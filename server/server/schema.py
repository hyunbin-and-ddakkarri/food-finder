# pylint: disable = fixme, too-few-public-methods, too-many-arguments, unused-argument
# todo: remove unused-argument

"""
todo: write docstring
"""

from typing import List, Union
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


# Restaurant data type
@strawberry.type
class Restaurant:
    id: strawberry.ID
    name: str
    introduction: str
    address: str
    location: List[float]
    region: str
    phone: str
    price: int
    businessHours: JSON
    moods: List[str]
    characteristics: List[str]
    images: List[str]
    menus: JSON
    reviews: List[Review]
    rating: float


# TODO: connect to DB
# restaurant resolver function
def get_restaurants(id: Union[None, int] = None, name: Union[None, str] = None, region: Union[None, str] = None,
                    price: Union[None, int] = None, moods: Union[None, List[str]] = None, characteristics: Union[None, List[str]] = None,
                    rating: Union[None, float] = None, limit: Union[None, int] = None):
    return [
        Restaurant(
            id=strawberry.ID("test"),
            name="Asobu",
            introduction="A best place for KAIST students",
            address="14, Eoeun-ro 48beon-gil, Yuseong-gu, Daejeon-si",
            location=[34.21, 66.55],
            region="Sinsa-dong",
            phone="042-XXX-XXXX",
            price=9500,
            businessHours={
                'Mon': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Tue': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Wed': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Thu': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Fri': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Sat': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
                'Sun': [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0,
                ],
            },
            moods=["Cozy", "Affordable"],
            characteristics=["Sushi", "Donburi"],
            images=["path/to/image1"],
            menus={
                "menu A": 9500,
                "menu B": 11000,
            },
            reviews=[Review(
                username="minji",
                rating=1.0,
                context="Good",
                date="2023-05-29"
            )],
            rating=4.6
        )
    ]


# TODO: setup authentication
# Query
@strawberry.type
class Query:
    restaurants: List[Restaurant] = strawberry.field(resolver=get_restaurants)


# TODO: setup mutation
# Mutation for Restaurant data manipulation
@strawberry.type
class Mutation:
    """
    todo: write docstring
    """


schema = strawberry.Schema(query=Query)
