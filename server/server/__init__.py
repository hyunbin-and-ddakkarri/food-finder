"""
The server module implements backend server for the project.
"""

from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from .schema import schema
from .env import get_env
from .db import Database


run_mode = get_env("RUN_MODE")
graphql_app: GraphQLRouter
if run_mode == "dev":
    graphql_app = GraphQLRouter(schema)
elif run_mode == "production":
    graphql_app = GraphQLRouter(schema, graphiql=False)


app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")



@app.on_event("startup")
async def startup():
    """
    server startup function
    """
    await Database.init()


@app.on_event("shutdown")
async def shutdown():
    """
    server shutdown function
    """
    await Database.deinit()