"""Utility functions for returning responses to the http gateway."""

import json
from typing import Dict, List, Optional, Union


def response(status: int, data: Optional[Union[Dict, List]] = None) -> Dict:
    """Return a response with a given status code and with a JSON payload."""
    if data is None:
        data = {}
    return {
        "statusCode": status,
        "body": json.dumps(data),
        "headers": {
            "Access-Control-Allow-Origin": "*"
        }
    }


def ok(data: Optional[Union[Dict, List]] = None) -> Dict:
    """Return a OK response with a JSON payload."""
    return response(200, data)


def not_found(data: Optional[Union[Dict, List]] = None) -> Dict:
    """Return a NOT FOUND response with a JSON payload."""
    return response(404, data)
