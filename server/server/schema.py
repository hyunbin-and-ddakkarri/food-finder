# pylint: disable = fixme, too-few-public-methods, too-many-arguments, unused-argument, invalid-name
# mypy: ignore-errors =
# todo: remove unused-argument

"""
todo: write docstring
"""

import datetime
from typing import Generic, List, Optional, TypeVar
import json
from functools import reduce

from sqlalchemy import and_
import strawberry
from strawberry.scalars import JSON

from .db import models, Database

T = TypeVar("T")


@strawberry.input
class AbelFilter(Generic[T]):
    eq: Optional[T] = None
    gt: Optional[T] = None
    lt: Optional[T] = None
    gte: Optional[T] = None
    lte: Optional[T] = None
    in_: Optional[T] = None
    order_by: Optional[List[str]] = None

    def where_clause(self, column):
        if self.eq is not None:
            return column == self.eq
        elif self.gt is not None:
            return column > self.gt
        elif self.lt is not None:
            return column < self.lt
        elif self.gte is not None:
            return column >= self.gte
        elif self.lte is not None:
            return column <= self.lte
        elif self.in_ is not None:
            return column.in_(tuple(self.in_))


@strawberry.input
class ReviewFilter:
    username: Optional[AbelFilter[str]] = None
    rating: Optional[AbelFilter[float]] = None
    context: Optional[AbelFilter[str]] = None
    date: Optional[AbelFilter[str]] = None

    restaurant_id: Optional[AbelFilter[str]] = None

    def where_clause(self):
        where = []

        if self.username is not None:
            where.append(self.username.where_clause(models.Review.username))
        if self.rating is not None:
            where.append(self.rating.where_clause(models.Review.rating))
        if self.context is not None:
            where.append(self.context.where_clause(models.Review.context))
        if self.date is not None:
            where.append(self.date.where_clause(models.Review.date))
        if self.restaurant_id is not None:
            where.append(self.restaurant_id.where_clause(models.Review.restaurant_id))

        return reduce(and_, where) if len(where) > 0 else None


# Review data type
@strawberry.type
class Review:
    """
    Review strawberry type for GraphQL
    """

    rid: strawberry.ID
    username: str
    rating: float
    context: str
    date: datetime.datetime

    restaurant_id: str

    @staticmethod
    def from_model(review: models.Review) -> "Review":
        """
        Converts Review model to Review object
        """
        return Review(
            rid=strawberry.ID(review.rid),
            username=review.username,
            rating=review.rating,
            context=review.context,
            date=review.date,
        )


@strawberry.input
class RestaurantFilter:
    name: Optional[AbelFilter[str]] = None
    introduction: Optional[AbelFilter[str]] = None
    address: Optional[AbelFilter[str]] = None
    location_x: Optional[AbelFilter[float]] = None
    location_y: Optional[AbelFilter[float]] = None
    region: Optional[AbelFilter[str]] = None
    phone: Optional[AbelFilter[str]] = None
    price: Optional[AbelFilter[int]] = None
    businessHours: Optional[AbelFilter[JSON]] = None
    moods: Optional[AbelFilter[List[str]]] = None
    characteristics: Optional[AbelFilter[List[str]]] = None
    images: Optional[AbelFilter[List[str]]] = None
    menus: Optional[AbelFilter[JSON]] = None
    reviews: Optional[AbelFilter[List[Review]]] = None
    rating: Optional[AbelFilter[float]] = None

    def where_clause(self):
        where = []

        if self.name is not None:
            where.append(self.name.where_clause(models.Restaurant.name))
        if self.introduction is not None:
            where.append(self.introduction.where_clause(models.Restaurant.introduction))
        if self.address is not None:
            where.append(self.address.where_clause(models.Restaurant.address))
        if self.location_x is not None:
            where.append(self.location_x.where_clause(models.Restaurant.location_x))
        if self.location_y is not None:
            where.append(self.location_y.where_clause(models.Restaurant.location_y))
        if self.region is not None:
            where.append(self.region.where_clause(models.Restaurant.region))
        if self.phone is not None:
            where.append(self.phone.where_clause(models.Restaurant.phone))
        if self.price is not None:
            where.append(self.price.where_clause(models.Restaurant.price))
        if self.businessHours is not None:
            where.append(
                self.businessHours.where_clause(models.Restaurant.businessHours)
            )
        if self.moods is not None:
            where.append(self.moods.where_clause(models.Restaurant.moods))
        if self.characteristics is not None:
            where.append(
                self.characteristics.where_clause(models.Restaurant.characteristics)
            )
        if self.images is not None:
            where.append(self.images.where_clause(models.Restaurant.images))
        if self.menus is not None:
            where.append(self.menus.where_clause(models.Restaurant.menus))
        if self.reviews is not None:
            where.append(self.reviews.where_clause(models.Restaurant.reviews))
        if self.rating is not None:
            where.append(self.rating.where_clause(models.Restaurant.rating))

        return reduce(and_, where) if len(where) > 0 else None


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

    @staticmethod
    def from_model(restaurant: models.Restaurant) -> "Restaurant":
        """
        Converts Restaurant model to Restaurant object
        """
        return Restaurant(
            rid=strawberry.ID(restaurant.rid),
            name=restaurant.name,
            introduction=restaurant.introduction,
            address=restaurant.address,
            location=[restaurant.location_x, restaurant.location_y],
            region=restaurant.region,
            phone=restaurant.phone,
            price=restaurant.price,
            businessHours=json.loads(restaurant.businessHours),
            moods=json.loads(restaurant.moods),
            chars=json.loads(restaurant.characteristics),
            imgs=json.loads(restaurant.images),
            menus=json.loads(restaurant.menus),
            reviews=[Review.from_model(review) for review in restaurant.reviews],
            rating=restaurant.rating,
        )


async def get_restaurants(where: RestaurantFilter) -> List[Restaurant]:
    """
    Get restaurants from database
    """
    async with Database.async_session() as session:
        stmt = Database.select(models.Restaurant)
        if where is not None:
            stmt = stmt.where(where.where_clause())
        result = await session.execute(stmt)
        return [Restaurant.from_model(restaurant) for restaurant in result.scalars()]


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
