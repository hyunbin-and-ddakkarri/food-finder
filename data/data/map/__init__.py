# pylint: disable=too-few-public-methods

"""
Map base module
"""

from server import schema


class Restaurant:
    """
    Restaurant abstract class
    """

    @property
    def _id(self) -> str:
        """
        :return: The id of the restaurant
        """

    async def get(self) -> schema.Restraunt:
        """
        :return: The restaurant data
        """


class Map:
    """
    Map abstract class
    """

    @staticmethod
    def name() -> str:
        """
        :return: The name of the map
        """

    async def get_restaurants(self):
        """
        :yield: The restaurants in the map
        """
