# pylint: disable=invalid-name, redefined-builtin, global-statement, broad-exception-caught

"""
Main server for the data module
"""

import asyncio
import logging
from typing import Any

from fastapi import FastAPI
from sqlalchemy import func, select

from data.db import Database, models
from data.fetch import Fetch
from data.map.naver import NaverMap

state: dict[str, Any] = {}


async def do_search(id: str, query: str, limit: int = 10) -> None:
    """
    Search naver map for the given query
    then, put the data into db
    """
    try:
        Fetch.init(
            [
                # this needs to be waited a lot
                (".*pcmap-api\\.place\\.naver\\.com.*", 5000),
                (".*map\\.naver\\.com.*", 10),
                (".*pcmap\\.place\\.naver\\.com.*", 10),
            ]
        )

        await Database.init()
        assert Database.async_session is not None

        cnt = 0
        async for i in NaverMap(query).get_restaurants():
            cnt += 1
            res = await i.get()
            rev = await i.get_reviews()
            async with Database.async_session() as session:
                stmt = (
                    # func.count is actually callable
                    select(func.count())  # pylint: disable=not-callable
                    .select_from(models.Restaurant)
                    .where(models.Restaurant.id == res.id)
                )
                count = (await session.execute(stmt)).scalar()
                if count == 0:
                    session.add(res)
                await session.commit()

            async with Database.async_session() as session:
                for r in rev:
                    stmt = (
                        # func.count is actually callable
                        select(func.count())  # pylint: disable=not-callable
                        .select_from(models.Review)
                        .where(models.Review.id == r.id)
                    )
                    count = (await session.execute(stmt)).scalar()
                    if count == 0:
                        session.add(r)
                await session.commit()
            state[id]["count"] = cnt
            if cnt >= limit:
                break
    except asyncio.CancelledError:
        state[id]["state"] = "cancelled"
        return
    except Exception as e:
        state[id]["state"] = "error"
        logging.error(e)
        return
    state[id]["state"] = "done"


id_cnt = 0

app = FastAPI()


@app.post("/start")
async def start(query: str, limit: int = 10) -> dict[str, Any]:
    """
    Start searching for the given query
    """
    global id_cnt
    id_cnt += 1
    id = f"{id_cnt}"
    loop = asyncio.get_event_loop()
    state[id] = {
        "task": loop.create_task(do_search(id, query, limit)),
        "query": query,
        "limit": limit,
        "id": id,
        "count": 0,
        "state": "running",
    }
    return {"status": True, "id": id}


@app.get("/info/{id}")
def get_info(id: str) -> dict[str, Any]:
    """
    Get the information of the given id
    """
    if id in state:
        return {
            "status": True,
            "count": state[id]["count"],
            "limit": state[id]["limit"],
            "query": state[id]["query"],
            "id": state[id]["id"],
            "state": state[id]["state"],
        }
    return {"status": False}


@app.post("/stop/{id}")
def stop(id: str) -> dict[str, Any]:
    """
    Stop the task of the given id
    """
    if id in state:
        state[id]["task"].cancel()
        return {"status": True}
    return {"status": False}
