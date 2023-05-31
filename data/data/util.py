import json

def parse_int(s: str) -> int:
    """
    This only encodes digits and converts to int

    :param s: The string to convert to int
    :return: The converted int
    """
    return int("".join([i for i in s if i.isdigit()]))


def parse_json_until(s: str) -> dict:
    """
    This parses json until it is valid

    :param s: The string to parse
    :return: The parsed json
    """
    cnt = 0
    for i in range(len(s)):
        if s[i] == "{" or s[i] == "[":
            cnt += 1
        elif s[i] == "}" or s[i] == "]":
            cnt -= 1
        if cnt == 0:
            return json.loads(s[:i + 1])