"""Utility functions for returning responses to the http gateway."""

import json
from typing import Dict, List, Union


def response(status: int, data: Union[Dict, List]) -> Dict:
    """Return a response with a given status code and with a JSON payload."""
    return {
        "statusCode": status,
        "body": json.dumps(data)
    }


def ok(data: Union[Dict, List]) -> Dict:
    """Return a OK response with a JSON payload."""
    return response(200, data)
