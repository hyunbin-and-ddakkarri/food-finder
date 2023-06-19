# pylint: disable=too-many-locals

"""
Fetch module

this would fetch the url by asyncio + aiohttp
"""

import asyncio
import datetime
import json
import random
import re
from concurrent.futures import ThreadPoolExecutor
from enum import Enum
from re import Pattern
from typing import Any, Dict, List, Optional, Tuple

import aiohttp
import requests


class Method(Enum):
    """
    Method class to request url
    """

    GET = "GET"
    POST = "POST"
    OPTIONS = "OPTIONS"
    HEAD = "HEAD"
    PATCH = "PATCH"
    DELETE = "DELETE"
    PUT = "PUT"


class Fetch:
    """
    Fetch class to fetch with time limit

    This would wait to request the url
    """

    limit: List[Tuple[Pattern[str], datetime.timedelta]]
    next_time: Dict[Pattern[str], datetime.datetime]
    pool: ThreadPoolExecutor
    cookie_jar: Optional[aiohttp.CookieJar]

    @classmethod
    def init(cls, limit: List[Tuple[str, int]], max_workers: int = 32) -> None:
        """
        This would initialize the Fetch class instance
        If "*.map.naver.com" should be called at most once per 1 sec,
        You can call:

        ```python
        Fetch.init([(".*.map.naver.com.*", 1000)])
        ```

        :param limit: this is a list of url patterns (in regex) and limits (in milliseconds)
        :param max_workers: max workers for thread pool executor
        :return: None
        """
        # this is for matching leftover things as 0 sec of limit
        limit.append((".*", 0))
        cls.limit = list(
            map(
                lambda a: (re.compile(a[0]), datetime.timedelta(milliseconds=a[1])),
                limit,
            )
        )
        cls.next_time = {}

        for pat, _ in cls.limit:
            cls.next_time[pat] = datetime.datetime.now()

        cls.pool = ThreadPoolExecutor(max_workers=max_workers)
        cls.cookie_jar = None

    @classmethod
    def init_from_file(cls, path: str) -> None:
        """
        reads json file and initialize the Fetch

        :param path: path to json file
        :return: None
        """
        with open(path, "r", encoding="utf-8") as file:
            obj = json.load(file)
            limit = []
            for pat in obj:
                limit.append((pat, obj[pat]))
            Fetch.init(limit)

    @classmethod
    def init_default(cls) -> None:
        """
        sets to default value
        """
        Fetch.init(
            [
                (".*map\\.naver\\.com.*", 10),
            ]
        )

    @classmethod
    async def request(
        cls,
        method: Method,
        url: str,
        use_requests: bool = False,
        use_cookie_jar: bool = False,
        **kwargs: Any,
    ) -> str:
        """
        request function with appropriate async delay

        :param method: method to request
        :param url: url to request
        :param kwargs: options to request (see [aiohttp request][1] for more information)
        :param use_requests: set True if you want to use requests instead of aiohttp
        :param use_cookie_jar: set True if you want to use cookie jar
        :return: response of aiohttp request (see [aiohttp response object][2] for more information)

        [1](https://docs.aiohttp.org/en/stable/client_reference.html#aiohttp.ClientSession)
        [2](https://docs.aiohttp.org/en/stable/client_reference.html#aiohttp.ClientResponse)
        """
        for pat, limit in cls.limit:
            if not re.match(pat, url):
                continue

            next_time = cls.next_time[pat]
            wait_time = 0.0
            now = datetime.datetime.now()
            if next_time > now:
                delta = next_time - now
                wait_time = delta.seconds + delta.microseconds / 1_000_000
                cls.next_time[pat] = next_time + limit
            else:
                cls.next_time[pat] = now + limit

            if wait_time > 0:
                wait_time *= random.uniform(0.9, 1.1)
                await asyncio.sleep(wait_time)
            break

        if use_requests:
            loop = asyncio.get_event_loop()

            def wrap() -> str:
                return requests.request(method.value, url, timeout=10, **kwargs).text

            requests_res = await loop.run_in_executor(cls.pool, wrap)
            return requests_res

        cookie_jar = None
        if use_cookie_jar:
            if cls.cookie_jar is None:
                cls.cookie_jar = aiohttp.CookieJar(unsafe=True)
            cookie_jar = cls.cookie_jar
        async with aiohttp.ClientSession(cookie_jar=cookie_jar) as session:
            async with session.request(method.value, url, **kwargs) as response:
                return await response.text()

    @classmethod
    async def get(cls, url: str, **kwargs: Any) -> str:
        """
        short version of Fetch.request(Method.GET, url, **kwargs)
        see Fetch.request for more information

        :param url: url to request
        :param kwargs: more option
        :return: aiohttp response object
        """
        return await Fetch.request(Method.GET, url, **kwargs)

    @classmethod
    async def post(cls, url: str, **kwargs: Any) -> str:
        """
        short version of Fetch.request(Method.POST, url, **kwargs)
        see Fetch.request for more information

        :param url: url to request
        :param kwargs: more option
        :return: aiohttp response object
        """
        return await Fetch.request(Method.POST, url, **kwargs)
