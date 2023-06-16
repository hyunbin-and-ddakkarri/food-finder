from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.ext.asyncio import async_sessionmaker
import asyncio
from ..env import get_env
from .models import Base


class Database:
    engine: AsyncEngine | None

    @classmethod
    async def init(cls) -> None:
        username = get_env("SQL_USER")
        password = get_env("SQL_PASSWORD")
        url = get_env("SQL_HOST")
        db = get_env("SQL_DB")

        for _ in range(int(get_env("SQL_RETRY"))):
            try:
                print("Connecting to database...")
                engine = create_async_engine(
                    f"postgresql+asyncpg://{username}:{password}@{url}/{db}", echo=True
                )
                break
            except KeyboardInterrupt as err:
                raise KeyboardInterrupt from err
            except Exception:  # pylint: disable = broad-except
                print("Failed to connect to database, retrying...")
                await asyncio.sleep(5)
        else:
            raise Exception("Unable to connect to database")

        cls.engine = engine
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        cls.async_session = async_sessionmaker(cls.engine, expire_on_commit=False)

    @classmethod
    async def deinit(cls) -> None:
        if hasattr(cls, "engine"):
            await cls.engine.dispose()
