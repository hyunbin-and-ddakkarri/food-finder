# pylint: disable=too-few-public-methods

"""
This file defines the database models.
"""

import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(AsyncAttrs, DeclarativeBase):
    """
    Base class for all models
    """


class Review(Base):
    """
    Review model
    """

    __tablename__ = "review"

    id: Mapped[str] = mapped_column(primary_key=True)
    username: Mapped[str]
    rating: Mapped[float]
    context: Mapped[str]
    date: Mapped[datetime.date]

    restaurant: Mapped[str] = mapped_column(ForeignKey("restaurant.id"))


class Restaurant(Base):
    """
    Restaurant model
    """

    __tablename__ = "restaurant"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    introduction: Mapped[str]
    address: Mapped[str]
    location_x: Mapped[float]
    location_y: Mapped[float]
    region: Mapped[str]
    phone: Mapped[str]
    price: Mapped[int]
    business_hours: Mapped[str]
    moods: Mapped[str]
    characteristics: Mapped[str]
    images: Mapped[str]
    menus: Mapped[str]
    rating: Mapped[float]
