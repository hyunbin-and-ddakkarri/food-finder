import os

default_env = {
    "RUN_MODE": "dev",
    "MYSQL_HOST": "localhost",
    "MYSQL_USER": "test",
    "MYSQL_PASSWORD": "password123",
    "MYSQL_DB": "test"
}


def get_env(key: str):
    """
    get env var
    """
    value = os.environ.get(key)
    if value is None:
        value = default_env.get(key)
    return value