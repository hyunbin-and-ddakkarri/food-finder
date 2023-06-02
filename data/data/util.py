# pylint: disable=invalid-name

"""
This file contains utility functions for the data module
"""

import json


def parse_int(ipt: str) -> int:
    """
    This only encodes digits and converts to int

    :param s: The string to convert to int
    :return: The converted int
    """
    try:
        return int("".join([i for i in ipt if i.isdigit()]))
    except ValueError:
        return 0


def parse_json_until(ipt: str) -> dict:
    """
    This parses json until it is valid

    :param s: The string to parse
    :return: The parsed json
    """
    cnt = 0
    for i, c in enumerate(ipt):
        if c in ('{', '['):
            cnt += 1
        elif c in ('{', '['):
            cnt -= 1
        if cnt == 0:
            return json.loads(ipt[: i + 1])
    return {}
