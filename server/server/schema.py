# pylint: disable = fixme, too-few-public-methods, too-many-arguments, unused-argument
# todo: remove unused-argument

"""
todo: write docstring
"""

from typing import List
import strawberry
from strawberry.scalars import JSON


# Review data type
@strawberry.type
class Review:
    """
    todo: write docstring
    """

    username: str
    rating: float
    context: str
    date: str


# Restraunt data type
@strawberry.type
class Restraunt:
    """
    todo: write docstring
    """

    _id: strawberry.ID
    name: str
    introduction: str
    address: str
    location: List[float]
    region: str
    phone: str
    price: int
    buisnessHours: JSON
    moods: List[str]
    characteristics: List[str]
    images: List[str]
    menus: JSON
    reviews: List[Review]
    rating: float


# TODO: connect to DB
# restraunt resolver function
def get_restraunts(
    _id: None | int = None,
    name: None | str = None,
    region: None | str = None,
    price: None | int = None,
    moods: None | List[str] = None,
    characteristics: None | List[str] = None,
    rating: None | float = None,
    limit: None | int = None,
) -> List[Restraunt]:
    """
    todo: write docstring
    """
    return [
        Restraunt(
            _id=strawberry.ID("test"),
            name="test",
            introduction="test",
            address="test",
            location=[1, 1],
            region="test",
            phone="test",
            price=1,
            buisnessHours={"test": [1, 1]},
            moods=["test"],
            characteristics=["test"],
            images=["test"],
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
    todo: write docstring
    """

    restraunts: List[Restraunt] = strawberry.field(resolver=get_restraunts)


# TODO: setup mutation
# Mutation for Restraunt data manipulation
@strawberry.type
class Mutation:
    """
    todo: write docstring
    """


schema = strawberry.Schema(query=Query)
