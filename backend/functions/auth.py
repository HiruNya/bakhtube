import json
from hashlib import sha256
from hmac import compare_digest, digest
import jwt
from os import environ
import requests
from time import time
from typing import Dict
import urllib.parse
from uuid import uuid4

from config import SUPPORTED_DOMAINS
from response import bad_request, ok, forbidden

AUTH_REDIRECT_URL: str = environ["AUTH_REDIRECT_URL"]
AUTH_SECRET: bytes = bytes(environ["AUTH_SECRET"], 'utf-8')
GOOGLE_AUTH_ENDPOINT: str = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_CLIENT_ID: str = environ["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET: str = environ["GOOGLE_CLIENT_SECRET"]
GOOGLE_TOKEN_ENDPOINT: str = "https://oauth2.googleapis.com/token"


def auth(_event, _context):
    uuid = uuid4()
    verify = str(uuid)
    redirect_url = AUTH_REDIRECT_URL
    state: str = digest(AUTH_SECRET, bytes(str(uuid), 'utf-8'), sha256).hex()
    url = GOOGLE_AUTH_ENDPOINT + "?" + urllib.parse.urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "response_type": "code",
        "scope": "openid email",
        "redirect_uri": redirect_url,
        "state": state,
    })
    return ok({"url": url, "verify": verify})


def verify(event, _context):
    try:
        params: Dict[str, str] = json.loads(event['body'])
    except TypeError:
        return bad_request("No JSON body.")
    try:
        code = params['code']
        state = params['state']
        verify = bytes(params['verify'], 'utf-8')
    except KeyError:
        return bad_request("JSON object must have `code`, `state`, and `verify` fields.")
    if compare_digest(bytes.fromhex(state), digest(AUTH_SECRET, verify, sha256)):
        token = requests.post(GOOGLE_TOKEN_ENDPOINT, data={
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': AUTH_REDIRECT_URL,
            'grant_type': 'authorization_code',
        }).json()['id_token']
        token = jwt.decode(token, verify=False)
        print(token['email'])
        if not verify_email(token['email']):
            return forbidden("Not a supported domain.")
        expiry = int(time() + 24*60*60)
        token = jwt.encode(payload={
            'email': token['email'],
            'expiry': expiry,
        }, key=AUTH_SECRET, algorithm='HS256').decode('utf-8')
        return ok({"token": token})
    else:
        return bad_request("Verification code did not match state.")


def verify_email(email: str) -> bool:
    user, domain = email.split(sep='@', maxsplit=1)
    return domain in SUPPORTED_DOMAINS
