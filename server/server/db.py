# pylint: disable = too-many-arguments, invalid-name, fixme
"""
Module for handling database
"""

from typing import List
import json
import psycopg2
import strawberry
from server.env import get_env
from server.schema import Restaurant, Review


class DBHandler:
    """
    DB handler class for handling restaurant data
    """

    def __init__(self) -> None:
        """
        Initialization connects to db server
        """
        self.conn = psycopg2.connect(
            "dbname="
            + get_env("SQL_DB")
            + " user="
            + get_env("SQL_USER")
            + " password="
            + get_env("SQL_PASSWORD")
            + " host="
            + get_env("SQL_HOST")
        )
        self.cur = self.conn.cursor()
        self.open = True

    def create_table(self) -> None:
        """
        Create table if not exists
        """
        self.cur.execute(
            """
                    CREATE TABLE IF NOT EXISTS Restaurant (id varchar(255) PRIMARY_KEY,
                    name varchar(255), introduction varchar(255), address varchar(255),
                    location varchar(255), region varchar(255), phone varchar(255),
                    price varchar(255), businessHours varchar(1023), moods varchar(1023),
                    characteristics varchar(255), images varchar(1023), menus varchar(1023),
                    reviews varchar(2047), rating varchar(255));
                    """
        )
        self.conn.commit()

    def get_restaurant_data(
        self,
        rid: None | strawberry.ID = None,
        name: None | str = None,
        region: None | str = None,
        price: None | int = None,
        # moods: None | List[str] = None,
        # characteristics: None | List[str] = None,
        rating: None | float = None,
        limit: None | int = None,
    ) -> List[Restaurant]:
        """
        Get restaurant data from db
        """
        conditions = []
        cmd = "SELECT * FROM Restaurant"

        if rid is not None:
            conditions.append("id = " + rid)
        if name is not None:
            conditions.append("name = " + name)
        if region is not None:
            conditions.append("region = " + region)
        if price is not None:
            conditions.append("price = " + str(price))
        # if moods is not None:
        #     conditions.append("moods = " + moods)
        # if characteristics is not None:
        #     conditions.append("characteristics = " + characteristics)
        if rating is not None:
            conditions.append("rating = " + str(rating))

        if len(conditions) != 0:
            cmd += " WHERE "
            cmd += " AND ".join(conditions)

        if limit is not None:
            cmd += " LIMIT " + str(limit)

        self.cur.execute(cmd)
        return [
            Restaurant(
                rid=strawberry.ID(res[0]),
                name=res[1],
                introduction=res[2],
                address=res[3],
                location=[float(r) for r in res[4].split(", ")],
                region=res[5],
                phone=res[6],
                price=int(res[7]),
                businessHours=json.loads(res[8]),
                moods=res[9].split(", "),
                chars=res[10].split(", "),
                imgs=res[11].split(", "),
                menus=json.loads(res[12]),
                reviews=[Review.from_dict(json.loads(r)) for r in res[13].split("; ")],
                rating=float(res[14]),
            )
            for res in self.cur.fetchall()
        ]

    def put_restaurant_data(self, data: List[Restaurant]) -> None:
        """
        Put restaurant data into db
        """
        for rd in data:
            self.cur.execute(
                """
                INSERT INTO Restaurant (name, introduction, address, location, region,
                phone, price, businessHours, moods, characteristics, images, menus,
                reviews, rating)
                VALUES (%(name)s, %(introduction)s, %(address)s, %(location)s,
                %(region)s, %(phone)s, %(price)s, %(businessHours)s,
                %(moods)s, %(chars)s, %(imgs)s, %(menus)s, %(reviews)s, %(rating)s);
                """,
                rd.to_dict(),
            )
        self.conn.commit()

    def modify_restaurant(self, data: List[Restaurant]) -> None:
        """
        Modify restaurant data in db
        """
        for rd in data:
            self.cur.execute(
                """
                UPDATE Restaurant
                SET name = %(name)s, introduction = %(introduction)s, address = %(address)s,
                location = %(location)s, region = %(region)s, phone = %(phone)s, price = %(price)s,
                businessHours = %(businessHours)s,moods = %(moods)s, characteristics = %(chars)s,
                images = %(imgs)s, menus = %(menus)s, reviews = %(reviews)s, rating = %(rating)s
                WHERE id = %(rid)s;
                """,
                rd.to_dict(),
            )
        self.conn.commit()

    def update_search(self) -> None:
        """
        Updates search/ directory for meilisearch
        """
        # todo: do something
        return None

    def close(self) -> None:
        """
        Close connection to db
        """
        self.cur.close()
        self.conn.close()
        self.open = False
