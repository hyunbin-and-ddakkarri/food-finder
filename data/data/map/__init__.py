from server import schema

class Restaurant:
    @property
    def id(self) -> str:
        pass

    async def get(self) -> schema.Restraunt:
        """
        :return: The restaurant data
        """
        pass

class Map:
    """
    Map abstract class
    """

    @classmethod
    def name() -> str:
        """
        :return: The name of the map
        """
        pass

    @classmethod
    async def getRestaurants():
        """
        :yield: The restaurants in the map
        """
        pass