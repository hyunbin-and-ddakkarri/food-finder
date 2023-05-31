"""
This is the module for Naver Map

The default language of this module is Korean
"""

import itertools
import json
from typing import List
import re
import base64

from server import schema

from ..util import parse_int, parse_json_until
from ..fetch import Fetch
from . import Map, Restaurant


# regex to find the json data in the html
regex = re.compile("window.__APOLLO_STATE__ = ([\\s\\S]+)")

# user agent to use in graphql
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/16.5 Safari/605.1.15"
)

GRAPHQL_URL = "https://pcmap-api.place.naver.com/graphql"

# query for getting the count of the review
GRAPHQL_REVIEW_COUNT_QUERY = """
query getVisitorReviews($input: VisitorReviewsInput) {
    visitorReviews(input: $input) {
        total
    }
}
"""

# query for getting the review itself
GRAPHQL_REVIEW_QUERY = """
query getVisitorReviewPhotosInVisitorReviewTab($input: VisitorReviewsInput) {
    visitorReviews(input: $input) {
        items {
            rating
            author {
                nickname
            }
            body
            created
        }
    }
}
"""

# limit the max page to 10
REVIEW_MAX_PAGE = 10


class NaverRestaurant(Restaurant):
    """
    Naver Restaurant class
    """

    place_id: str

    def __init__(self, place_id: str):
        self.place_id = place_id

    @property
    def _id(self) -> str:
        """
        :return: The id of the restaurant
        """
        return f"naver:{self.place_id}"

    @property
    def url(self) -> str:
        """
        This is the url of json data of the restaurant information

        :return: The url of the restaurant information
        """
        return f"https://map.naver.com/v5/api/sites/summary/{self.place_id}?lang=ko"

    @property
    def detail_url(self) -> str:
        """
        This is the url of html data of the restaurant detail information

        :return: The url of the restaurant detail information
        """
        return f"https://pcmap.place.naver.com/restaurant/{self.place_id}/home"

    def graphql_variables(self, page: int) -> dict:
        """
        This is the graphql variables for getting the review
        """

        return {
            "input": {
                "businessId": self.place_id,
                "businessType": "restaurant",
                "item": "0",
                "bookingBusinessId": None,
                "page": page,  # if this is 0, graphql returns error
                "size": 10,
                "isPhotoUsed": False,
                "includeContent": True,
                "getUserStats": True,
                "includeReceiptPhotos": True,
                "cidList": [],
            }
        }

    def get_header(self) -> dict:
        """
        This is the header for graphql
        """

        data = {"args": self.place_id, "type": "restaurant", "source": "place"}

        return {
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Language": "ko",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Host": "pcmap-api.place.naver.com",
            "Origin": "https://pcmap.place.naver.com",
            "x-wtm-graphql": base64.b64encode(
                json.dumps(data).encode()
            ).decode(),  # this is a secret that a figured out
        }

    async def get_review(self) -> List[schema.Review]:
        """
        :return: The reviews of the restaurant
        """

        res = await Fetch.post(
            GRAPHQL_URL,
            json=[
                {
                    "variables": self.graphql_variables(1),
                    "query": GRAPHQL_REVIEW_COUNT_QUERY,
                }
            ],
            headers=self.get_header(),
        )
        total_review = json.loads(res)[0]["data"]["visitorReviews"]["total"]

        if total_review == 0:
            return []

        async def get_page(page: int) -> List[schema.Review]:
            res = await Fetch.post(
                GRAPHQL_URL,
                json=[
                    {
                        "variables": self.graphql_variables(page),
                        "query": GRAPHQL_REVIEW_QUERY,
                    }
                ],
                headers=self.get_header(),
            )
            try:
                data = json.loads(res)[0]["data"]["visitorReviews"]["items"]
            except json.JSONDecodeError:
                return []
            return [
                schema.Review(
                    username=review["author"]["nickname"],
                    context=review["body"],
                    rating=review["rating"]
                    if review["rating"] is not None
                    else -1,  # Naver Map doesn't have rating that much, so we need to handle this
                    date=review["created"],
                )
                for review in data
            ]

        # this asynchronously fetches all the pages
        return list(
            itertools.chain.from_iterable(
                await asyncio.gather(
                    *[
                        get_page(i)
                        for i in range(1, min(REVIEW_MAX_PAGE, total_review // 10 + 1))
                    ]
                )
            )
        )

    async def get(self) -> schema.Restraunt:
        """
        :return: The restaurant data
        """
        res = await Fetch.get(self.url)
        data = json.loads(res)

        price_sum = sum(parse_int(price["price"]) for price in data["menus"])
        detail_res = await Fetch.get(self.detail_url)
        detail_data = parse_json_until(regex.findall(detail_res)[0])
        for key, value in detail_data.items():
            if key.startswith("RestaurantBase"):
                rest_base = value
                break

        root = detail_data["ROOT_QUERY"]
        for key, value in root.items():
            if key.startswith("restaurant"):
                rest_data = value
                break

        biz_hour = {}
        for i in rest_data["newBusinessHours"][0]["businessHours"]:
            # if this is none, it means that the restaurant is closed on that day
            if i["businessHours"] is not None:
                biz_hour[i["day"]] = [
                    i["businessHours"]["start"],
                    i["businessHours"]["end"],
                ]
            else:
                biz_hour[i["day"]] = []

        return schema.Restraunt(
            id=self._id,
            name=data["name"],
            introduction=rest_base["microReviews"][
                0
            ],  # this is a short introduction (not description)
            address=data["address"],
            location=[data["x"], data["y"]],
            region=data["addressAbbr"].split(" ")[0],
            phone=data["phone"],
            price=price_sum // len(data["menus"]),
            buisnessHours=biz_hour,
            moods=rest_data["businessStats"]["contexts"][0]["keywords"],
            characteristics=[],
            images=[i["url"] for i in data["images"]],
            menus={menu["name"]: parse_int(menu["price"]) for menu in data["menus"]},
            reviews=await self.get_review(),
            rating=rest_base["visitorReviewsScore"],
        )


class NaverMap(Map):
    """
    Naver Map class
    """

    @staticmethod
    def name() -> str:
        """
        :return: The name of the map
        """
        return "naver"

    @staticmethod
    async def get_restaurants():
        """
        :yield: The restaurants in the map
        """


# sample test code
# pylint: disable=missing-function-docstring
if __name__ == "__main__":
    import asyncio

    Fetch.init(
        [
            (
                ".*pcmap-api\\.place\\.naver\\.com.*",
                1000,
            ),  # this needs to be wait a lot
            (".*map\\.naver\\.com.*", 10),
            (".*pcmap\\.place\\.naver\\.com.*", 10),
        ]
    )

    async def main():
        print(await NaverRestaurant("36175013").get())

    asyncio.run(main())
