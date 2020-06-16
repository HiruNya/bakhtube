"""Utility functions for returning responses to the http gateway."""

import json
from typing import Dict, List, Optional, Union


def response(status: int, data: Optional[Union[Dict, List]] = None, cookies: Optional[Dict[str, str]] = None) -> Dict:
    """Return a response with a given status code and with a JSON payload."""
    if data is None:
        data = {}
    if cookies is None:
        cookies = {}
    # multival_headers = {"Set-Cookie": f"{key}={val}" for key, val in cookies.items()}
    multival_headers = {"Set-Cookie": [f"{key}={val}" for key, val in cookies.items()]}

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
    }

    return {
        "statusCode": status,
        "body": json.dumps(data),
        "headers": headers,
        "multiValueHeaders": multival_headers,
    }


def ok(data: Optional[Union[Dict, List]] = None, cookies: Optional[Dict[str, str]] = None) -> Dict:
    """Return a OK response with a JSON payload."""
    return response(200, data, cookies=cookies)


def not_found(data: Optional[Union[Dict, List]] = None) -> Dict:
    """Return a NOT FOUND response with a JSON payload."""
    return response(404, data)

def forbidden(message: str) -> Dict:
    """Returns a 403 FORBIDDEN response with a message."""
    return response(403, {"error": message})

def bad_request(message: str) -> Dict:
    """Returns a 400 BAD REQUEST response with a message."""
    return response(400, {"error": message})
