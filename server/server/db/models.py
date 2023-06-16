import datetime
from typing import List, Tuple
from sqlalchemy import ForeignKey
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB


class Base(AsyncAttrs, DeclarativeBase):
    pass


class Review(Base):
    __tablename__ = "Review"

    rid: Mapped[str] = mapped_column(primary_key=True)
    username: Mapped[str]
    rating: Mapped[float]
    context: Mapped[str]
    date: Mapped[datetime.datetime]

    restaurant_id: Mapped[str] = mapped_column(ForeignKey("Restaurant.rid"))


class Restaurant(Base):
    __tablename__ = "Restaurant"

    rid: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    introduction: Mapped[str]
    address: Mapped[str]
    location_x: Mapped[float]
    location_y: Mapped[float]
    region: Mapped[str]
    phone: Mapped[str]
    price: Mapped[int]
    businessHours: Mapped[str] = mapped_column(JSONB)
    moods: Mapped[str]
    characteristics: Mapped[str]
    images: Mapped[str]
    menus: Mapped[str] = mapped_column(JSONB)
    reviews: Mapped[List[Review]] = relationship()
    rating: Mapped[float]
