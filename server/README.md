# Server

The back-end of the Food Finder app is managed by a single API server. This server provides read/write of restraunt data with authentication/authorization and data crawling.

## Setup

The server is written in python. Install `Python 3.9>=` and install dependencies using this code.

```zsh
pip install -r ./server/requirments.txt
```

> ❗️We strongly recommend using a virtual environment for easier version controls

## Run server (test)

Running server on your local device is simple. Just run the following code!

```zsh
strawberry server server.schema
```

This code will run an API server on your `localhost:8000`. You can access the GraphiQL page and try sending GraphQL queries.
