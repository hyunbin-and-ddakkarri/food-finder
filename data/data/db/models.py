import datetime
from typing import List, Tuple
from sqlalchemy import ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Review(Base):
    __tablename__ = "review"

    id: Mapped[str] = mapped_column(primary_key=True)
    username: Mapped[str]
    rating: Mapped[float]
    context: Mapped[str]
    date: Mapped[datetime.datetime]

    restaurant_id: Mapped[str] = mapped_column(ForeignKey("Restaurant.rid"))


class Restaurant(Base):
    __tablename__ = "restaurant"

    id: Mapped[int] = mapped_column(primary_key=True)
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
