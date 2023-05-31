import itertools
import json
from typing import List

from ..util import parse_int, parse_json_until
from ..fetch import Fetch
from server import schema
from . import Map, Restaurant
import re
import base64


regex = re.compile('window.__APOLLO_STATE__ = ([\\s\\S]+)')

user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15"

graphql_url = "https://pcmap-api.place.naver.com/graphql"

graphql_review_count_query = """
query getVisitorReviews($input: VisitorReviewsInput) {
    visitorReviews(input: $input) {
        total
    }
}
"""

graphql_review_query = """
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

review_max_page = 10


class NaverRestaurant(Restaurant):
    place_id: str

    def __init__(self, place_id: str):
        self.place_id = place_id

    @property
    def id(self) -> str:
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
        return {
            "input": {
                "businessId": self.place_id,
                "businessType": "restaurant",
                "item": "0",
                "bookingBusinessId": None,
                "page": page,
                "size": 10,
                "isPhotoUsed": False,
                "includeContent": True,
                "getUserStats": True,
                "includeReceiptPhotos": True,
                "cidList": [],
            }
        }

    def get_header(self) -> dict:
        data = {"args": self.place_id, "type": "restaurant", "source": "place"}

        return {
            "User-Agent": user_agent,
            "Accept": "*/*",
            "Accept-Language": "ko",
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Host": "pcmap-api.place.naver.com",
            "Origin": "https://pcmap.place.naver.com",
            "x-wtm-graphql": base64.b64encode(json.dumps(data).encode()).decode(),
        }

    async def get_review(self) -> List[schema.Review]:
        res = await Fetch.post(
            graphql_url,
            json=[
                {
                    "variables": self.graphql_variables(1),
                    "query": graphql_review_count_query,
                }
            ],
            headers=self.get_header(),
        )
        total_review = json.loads(res)[0]["data"]["visitorReviews"]["total"]

        if total_review == 0:
            return []

        async def get_page(page: int) -> List[schema.Review]:
            res = await Fetch.post(
                graphql_url,
                json=[
                    {
                        "variables": self.graphql_variables(page),
                        "query": graphql_review_query,
                    }
                ],
                headers=self.get_header(),
            )
            try:
                data = json.loads(res)[0]["data"]["visitorReviews"]["items"]
            except:
                return []
            return [
                schema.Review(
                    username=review["author"]["nickname"],
                    context=review["body"],
                    rating=review["rating"] if review["rating"] is not None else -1,
                    date=review["created"],
                )
                for review in data
            ]

        return list(
            itertools.chain.from_iterable(
                await asyncio.gather(
                    *[
                        get_page(i)
                        for i in range(1, min(review_max_page, total_review // 10 + 1))
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
        for k, v in detail_data.items():
            if k.startswith("RestaurantBase"):
                rest_base = v
                break
        
        root = detail_data["ROOT_QUERY"]
        for k, v in root.items():
            if k.startswith("restaurant"):
                rest_data = v
                break
            
        bizHour = {}
        for i in rest_data["newBusinessHours"][0]["businessHours"]:
            if i["businessHours"] is not None:
                bizHour[i["day"]] = [i["businessHours"]["start"], i["businessHours"]["end"]]
            else:
                bizHour[i["day"]] = []

        return schema.Restraunt(
            id=self.id,
            name=data["name"],
            introduction=rest_base["microReviews"][0],
            address=data["address"],
            location=[data["x"], data["y"]],
            region=data["addressAbbr"].split(" ")[0],
            phone=data["phone"],
            price=price_sum // len(data["menus"]),
            buisnessHours=bizHour,
            moods=rest_data["businessStats"]["contexts"][0]["keywords"],
            characteristics=[],
            images=[i["url"] for i in data["images"]],
            menus={menu["name"]: parse_int(menu["price"]) for menu in data["menus"]},
            reviews=await self.get_review(),
            rating=rest_base["visitorReviewsScore"],
        )


class NaverMap(Map):
    pass


if __name__ == "__main__":
    import asyncio

    Fetch.init(
        [
            (".*pcmap-api\\.place\\.naver\\.com.*", 1000),
            (".*map\\.naver\\.com.*", 10),
            (".*pcmap\\.place\\.naver\\.com.*", 10),
        ]
    )

    async def main():
        print(await NaverRestaurant("36175013").get())

    asyncio.run(main())
