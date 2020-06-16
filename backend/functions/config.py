"""Contains overridable constants"""
from typing import List

REGION: str = "ap-southeast-2"
SECTION_TABLE_NAME: str = "sectionTable"
VIDEO_TABLE_NAME: str = SECTION_TABLE_NAME
SUPPORTED_DOMAINS: List[str] = [
    "aucklanduni.ac.nz",
    "auckland.ac.nz",
]
