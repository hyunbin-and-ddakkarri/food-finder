"""
The server module implements backend server for the project.
"""

from strawberry.asgi import GraphQL
from server.schema import schema
from server.env import get_env


run_mode = get_env("RUN_MODE")
app: GraphQL
if run_mode == "dev":
    app = GraphQL(schema)
elif run_mode == "production":
    app = GraphQL(schema, graphiql=False)
