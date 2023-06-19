"""
Test for naver map
"""

import pytest

from data.fetch import Fetch
from data.map.naver import NaverMap


@pytest.mark.asyncio
async def test_naver_simple() -> None:
    """
    Simple test for naver

    (Just testing if there is no error)
    """

    Fetch.init(
        [
            # this needs to be waited a lot
            (".*pcmap-api\\.place\\.naver\\.com.*", 5000),
            (".*map\\.naver\\.com.*", 10),
            (".*pcmap\\.place\\.naver\\.com.*", 10),
        ]
    )

    async for item in NaverMap("어은동 맛집").get_restaurants():
        await item.get()
        break
