# pylint: disable = too-many-locals, too-many-branches, broad-exception-caught

"""
This is the module for Naver Map

The default language of this module is Korean
"""

import asyncio
import base64
import itertools
import json
import re
from typing import Any, AsyncGenerator, Dict, List

from data.db import models
from data.fetch import Fetch
from data.map import Map, Restaurant
from data.util import parse_int

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
# should be 10's multiple
REVIEW_MAX_PAGE = 1
REVIEW_PER_PAGE = 10
SEARCH_RESULT_PER_PAGE = 10


async def fetch_graphql(
    variables: Dict[str, Any], query: str, header: Dict[str, str]
) -> Any | None:
    """
    This is the function to fetch graphql
    """
    res = await Fetch.post(
        GRAPHQL_URL, json=[{"variables": variables, "query": query}], headers=header
    )
    try:
        return json.loads(res)
    except json.JSONDecodeError:
        # if decoding fails, it is probably because of the error
        # most common error is 429 (too many requests)
        return None


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
        return self.place_id

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
            # this is a secret that i figured out
            "x-wtm-graphql": base64.b64encode(json.dumps(data).encode()).decode(),
        }

    async def get_reviews(self) -> List[models.Review]:
        """
        :return: The reviews of the restaurant
        """

        res = await fetch_graphql(
            self.graphql_variables(1), GRAPHQL_REVIEW_COUNT_QUERY, self.get_header()
        )
        if res is None:
            return []
        total_review = res[0]["data"]["visitorReviews"]["total"]

        if total_review == 0:
            return []

        async def get_page(page: int) -> List[models.Review]:
            res = await fetch_graphql(
                self.graphql_variables(page), GRAPHQL_REVIEW_QUERY, self.get_header()
            )
            if res is None:
                return []
            data = res[0]["data"]["visitorReviews"]["items"]
            return [
                models.Review(
                    id=review["id"],
                    username=review["author"]["nickname"],
                    context=review["body"],
                    rating=review["rating"]
                    if review["rating"] is not None
                    else -1,  # Naver Map doesn't have rating that much, so we need to handle this
                    date=review["created"],
                    restaurant=self._id,
                )
                for review in data
            ]

        # this asynchronously fetches all the pages
        return list(
            itertools.chain.from_iterable(
                await asyncio.gather(
                    *[
                        get_page(i)
                        for i in range(
                            1, min(REVIEW_MAX_PAGE, total_review // 10 + 1) + 1
                        )
                    ]
                )
            )
        )

    async def get(self) -> models.Restaurant:
        """
        :return: The restaurant data
        """
        res = await Fetch.get(self.url)
        data = json.loads(res)

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
        if rest_data["newBusinessHours"] is not None:
            try:
                for i in rest_data["newBusinessHours"][0]["businessHours"]:
                    # if this is none, it means that the restaurant is closed on that day
                    if i["businessHours"] is not None:
                        biz_hour[i["day"]] = [
                            i["businessHours"]["start"],
                            i["businessHours"]["end"],
                        ]
                    else:
                        biz_hour[i["day"]] = []
            except Exception:
                biz_hour = {}

        if rest_data["businessStats"]["contexts"] is not None:
            moods = rest_data["businessStats"]["contexts"][0]["keywords"]
        else:
            moods = []

        return models.Restaurant(
            id=self._id,
            name=data["name"],
            introduction=introduction,
            address=data["address"],
            location_x=data["x"],
            location_y=data["y"],
            region=data["addressAbbr"].split(" ")[0],
            phone=data["phone"],
            price=int(price),
            business_hours=str(biz_hour),
            moods=str(moods),
            characteristics=str([]),
            images=str([i["url"] for i in data["images"]]),
            menus=str(menus),
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
            # this is a secret that i figured out
            "x-wtm-graphql": base64.b64encode(json.dumps(data).encode()).decode(),
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

        async def get_page(page: int) -> Any | None:
            res = await fetch_graphql(
                self.graphql_variables(page), GRAPHQL_SEARCH_QUERY, self.get_header()
            )
            if res is None:
                return None
            data = res[0]["data"]["restaurants"]
            return data

        first_page = await get_page(1)
        if first_page is None:
            return
        total = first_page["total"]
        page_count = total // SEARCH_RESULT_PER_PAGE + 1

        for i in range(1, page_count + 1):
            data = await get_page(i)
            if data is None:
                return
            for restaurant in data["items"]:
                yield NaverRestaurant(restaurant["id"])


# sample test code
# pylint: disable=missing-function-docstring, invalid-name
if __name__ == "__main__":
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
            for r in await i.get_reviews():
                print(r)

    asyncio.run(main())
