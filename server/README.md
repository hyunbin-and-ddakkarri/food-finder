# Server

The back-end of the Food Finder app is managed by a single API server. This server provides read/write of restaurant data with authentication/authorization and data crawling. 

## Setup

The server is written in python. Install `Python 3.9>=` and install dependencies using this code.

```zsh
pip install -r ./server/requirements.txt
```

> ❗️We strongly recommend using a virtual environment for easier version controls

We also need [PostgreSQL](https://www.postgresql.org) server and [meilisearch](https://www.meilisearch.com) server running for DB control and search engine.

### Setting up PostgreSQL

We first need to install PostgreSQL for DB server. You can simply install it running this code on bash. 

**For macOS users:**
```zsh
brew install postgresql@15              
```

**For Linux and Windows users:**

Check out the [Download](https://www.postgresql.org/download/) page and download the right PostgreSQL for your operating system. Install version 15. 

### Setting up meilisearch

Install meilisearch in `server/search` directory. 

**For macOS and Linux users:**
```bash
curl -L https://install.meilisearch.com | sh
```

**For Windows users:**

Check out the [Installation](https://www.meilisearch.com/docs/learn/getting_started/installation) page and download using the preferred way. 


## Run server (test)


### Run DB
TBA
### Run meilisearch server

Run the following code to start the meilisearch server. 
```bash
(food-finder/server/search)$ ./meilisearch --master-key="aSampleMasterKey"
```

We now need to link the json files in the `server/search`



### Run API server

After starting the DB server and meilisearch server, you are now ready to run the API server. 

```zsh
uvicorn server:app --reload
```

This code will run an API server on your `localhost:8000`. You can access the GraphiQL page and try sending GraphQL queries.
