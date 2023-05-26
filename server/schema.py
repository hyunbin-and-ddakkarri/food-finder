from typing import List, Union
import strawberry
from strawberry.scalars import JSON

# Restraunt data
@strawberry.type
class Restraunt:
    id: strawberry.ID
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
    reviews: List["Review"]
    rating: float


@strawberry.type
class Review:
    username: str
    rating: float
    context: str
    date: str

# TODO: connect to DB
def get_restraunts(id: Union[None, int] = None, name: Union[None, str] = None, region: Union[None, str] = None, 
                   price: Union[None, int] = None, moods: Union[None, List[str]] = None, characteristics: Union[None, List[str]] = None,
                    rating: Union[None, float] = None, limit: Union[None, int] = None):
    return [
        Restraunt(
            id=strawberry.ID("test"),
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
            reviews=[Review(
                username="test",
                rating=1.0,
                context="test",
                date="test"
            )],
            rating=1.0
        )
    ]

# TODO: setup authentication
@strawberry.type
class Query:
    restraunts: List[Restraunt] = strawberry.field(resolver=get_restraunts)


# TODO: setup mutation
@strawberry.type
class Mutation:
    pass


schema = strawberry.Schema(query=Query)

