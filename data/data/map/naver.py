# pylint: disable = too-many-locals, too-many-branches

"""
This is the module for Naver Map

The default language of this module is Korean
"""

import itertools
import json
from typing import AsyncGenerator, List, Dict, Any
import re
import base64

from server import schema

from data.util import parse_int
from data.fetch import Fetch
from data.map import Map, Restaurant


# regex to find the json data in the html
regex = re.compile("window.__APOLLO_STATE__ = (.+);\n")

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

GRAPHQL_SEARCH_QUERY = """
query getRestaurants(
  $restaurantListInput: RestaurantListInput
) {
    restaurants: restaurantList(input: $restaurantListInput) {
        total
        items {
            id
        }
    }
}
"""

# limit the max page to 10
REVIEW_MAX_PAGE = 1
REVIEW_PER_PAGE = 10
SEARCH_RESULT_PER_PAGE = 10


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

    def graphql_variables(self, page: int) -> Dict[str, Dict[str, Any]]:
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
                "size": REVIEW_PER_PAGE,
                "isPhotoUsed": False,
                "includeContent": True,
                "getUserStats": True,
                "includeReceiptPhotos": True,
                "cidList": [],
            }
        }

    def get_header(self) -> Dict[str, str]:
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
            ).decode(),  # this is a secret that i figured out
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
                schema.Review(  # type: ignore
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

        print(self._id)

        if data["menus"] is not None:
            price_sum = sum(parse_int(price["price"]) for price in data["menus"])
            menus = {menu["name"]: parse_int(menu["price"]) for menu in data["menus"]}
        else:
            price_sum = 0
            menus = {}
        price = price_sum / len(data["menus"]) if price_sum != 0 else 0
        detail_res = await Fetch.get(self.detail_url)
        detail_data = json.loads(regex.findall(detail_res)[0])
        for key, value in detail_data.items():
            if key.startswith("RestaurantBase"):
                rest_base = value
                break

        root = detail_data["ROOT_QUERY"]
        for key, value in root.items():
            if key.startswith("restaurant"):
                rest_data = value
                break

        if rest_base["microReviews"] is not None:
            introduction = rest_base["microReviews"][0]
        elif rest_base["description"] is not None:
            introduction = rest_base["description"]
        else:
            introduction = ""

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

        if rest_data["businessStats"]["contexts"] is not None:
            moods = rest_data["businessStats"]["contexts"][0]["keywords"]
        else:
            moods = []

        return schema.Restraunt(  # type: ignore
            id=self._id,
            name=data["name"],
            introduction=introduction,
            address=data["address"],
            location=[data["x"], data["y"]],
            region=data["addressAbbr"].split(" ")[0],
            phone=data["phone"],
            price=price,
            buisnessHours=biz_hour,
            moods=moods,
            characteristics=[],
            images=[i["url"] for i in data["images"]],
            menus=menus,
            reviews=await self.get_review(),
            rating=rest_base["visitorReviewsScore"],
        )


class NaverMap(Map):
    """
    Naver Map class
    """

    query: str

    def __init__(self, query: str):
        self.query = query

    @staticmethod
    def name() -> str:
        """
        :return: The name of the map
        """
        return "naver"

    def get_header(self) -> Dict[str, str]:
        """
        This is the header for graphql
        """

        data = {"args": self.query, "type": "restaurant", "source": "place"}

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
            ).decode(),  # this is a secret that i figured out
        }

    def graphql_variables(self, page: int) -> Dict[str, Dict[str, Any]]:
        """
        This is the graphql variables for the query
        """

        return {
            "restaurantListInput": {
                "deviceType": "pcmap",
                "display": SEARCH_RESULT_PER_PAGE,
                "query": self.query,
                "start": (page - 1) * SEARCH_RESULT_PER_PAGE + 1,
                "isPcmap": True,
                "x": "126.9698813",
                "y": "37.566551",
            }
        }

    async def get_restaurants(self) -> AsyncGenerator[Restaurant, None]:  # type: ignore
        """
        :yield: The restaurants in the map
        """

        async def get_page(page: int) -> Any:
            res = await Fetch.post(
                GRAPHQL_URL,
                json=[
                    {
                        "variables": self.graphql_variables(page),
                        "query": GRAPHQL_SEARCH_QUERY,
                    }
                ],
                headers=self.get_header(),
            )
            data = json.loads(res)[0]["data"]["restaurants"]
            return data

        first_page = await get_page(1)
        total = first_page["total"]
        page_count = total // SEARCH_RESULT_PER_PAGE + 1

        for i in range(1, page_count + 1):
            data = await get_page(i)
            for restaurant in data["items"]:
                yield NaverRestaurant(restaurant["id"])


# sample test code
# pylint: disable=missing-function-docstring
if __name__ == "__main__":
    import asyncio

    Fetch.init(
        [
            # this needs to be waited a lot
            (".*pcmap-api\\.place\\.naver\\.com.*", 5000),
            (".*map\\.naver\\.com.*", 10),
            (".*pcmap\\.place\\.naver\\.com.*", 10),
        ]
    )

    async def main() -> None:
        naver = NaverMap("어은동 맛집")
        async for i in naver.get_restaurants():
            await i.get()

    asyncio.run(main())
