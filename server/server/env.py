# pylint: disable = broad-exception-raised
"""
Environment variables
"""

import os

default_env = {
    "RUN_MODE": "dev",
    "SQL_HOST": "localhost",
    "SQL_USER": "test",
    "SQL_PASSWORD": "password123",
    "SQL_DB": "test",
}


def get_env(key: str) -> str:
    """
    get env var
    """
    value = os.environ.get(key)
    if value is None:
        value = default_env.get(key)
        if value is None:
            raise Exception("Environment variable " + key + " not found")
    return value
