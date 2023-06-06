# pylint: disable = fixme, too-few-public-methods, too-many-arguments, unused-argument, invalid-name
# mypy: ignore-errors =
# todo: remove unused-argument

"""
todo: write docstring
"""

from typing import List
import json
import strawberry
from strawberry.scalars import JSON


# Review data type
@strawberry.type
class Review:
    """
    Review strawberry type for GraphQL
    """

    username: str
    rating: float
    context: str
    date: str

    @staticmethod
    def from_dict(x: dict[str, str | float]) -> "Review":
        """
        Converts dictionary to Review object
        """
        r = Review(
            username=x["username"],
            rating=x["rating"],
            context=x["context"],
            date=x["date"],
        )
        return r


# Restaurant data type
@strawberry.type
class Restaurant:
    """
    Restaurant strawberry type for GraphQL
    """

    rid: strawberry.ID
    name: str
    introduction: str
    address: str
    location: List[float]
    region: str
    phone: str
    price: int
    businessHours: JSON
    moods: List[str]
    chars: List[str]
    imgs: List[str]
    menus: JSON
    reviews: List[Review]
    rating: float

    def to_dict(self) -> dict[str, str | int | float | JSON]:
        """
        Converts Restaurant object to dictionary for SQL query
        """
        res = self.__dict__
        res["location"] = ", ".join([str(l) for l in res["location"]])
        res["businessHours"] = json.dumps(res["businessHours"])
        res["moods"] = ", ".join(res["moods"])
        res["chars"] = ", ".join(res["chars"])
        res["imgs"] = ", ".join(res["imgs"])
        res["menus"] = json.dumps(res["menus"])
        res["reviews"] = "; ".join([r.__dict__ for r in res["reviews"]])
        return res

    def to_json(self) -> str:
        """
        Converts Restaurant object to JSON string recursively
        """
        return ""


# TODO: connect to DB
def get_restaurants(
    rid: None | strawberry.ID = None,
    name: None | str = None,
    region: None | str = None,
    price: None | int = None,
    moods: None | List[str] = None,
    characteristics: None | List[str] = None,
    rating: None | float = None,
    limit: None | int = None,
) -> List[Restaurant]:
    """
    restaurant resolver function
    """
    return [
        Restaurant(
            rid=strawberry.ID("test"),
            name="test",
            introduction="test",
            address="test",
            location=[1, 1],
            region="test",
            phone="test",
            price=1,
            businessHours={
                "monday": ["00:00", "00:00"],
            },
            moods=["test"],
            chars=["test"],
            imgs=["test"],
            menus={"test": 1},
            reviews=[Review(username="test", rating=1.0, context="test", date="test")],
            rating=1.0,
        )
    ]


# TODO: setup authentication
# Query
@strawberry.type
class Query:
    """
    Query for Restaurant data
    """

    restaurants: List[Restaurant] = strawberry.field(resolver=get_restaurants)


# TODO: setup mutation
# Mutation for Restaurant data manipulation
@strawberry.type
class Mutation:
    """
    Mutation for Restaurant data manipulation
    """


schema = strawberry.Schema(query=Query)
