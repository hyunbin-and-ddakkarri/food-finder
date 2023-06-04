# pylint: disable=too-few-public-methods

"""
Map base module
"""

from typing import AsyncGenerator
from abc import ABCMeta, abstractmethod

from server import schema


class Restaurant(metaclass=ABCMeta):
    """
    Restaurant abstract class
    """

    @property
    @abstractmethod
    def _id(self) -> str:
        """
        :return: The id of the restaurant
        """

    @abstractmethod
    async def get(self) -> schema.Restaurant:
        """
        :return: The restaurant data
        """


class Map(metaclass=ABCMeta):
    """
    Map abstract class
    """

    @staticmethod
    @abstractmethod
    def name() -> str:
        """
        :return: The name of the map
        """

    @abstractmethod
    async def get_restaurants(self) -> AsyncGenerator[Restaurant, None]:
        """
        :yield: The restaurants in the map
        """
