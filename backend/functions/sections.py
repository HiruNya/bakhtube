"""Resposible for getting and creating sections in the database."""

from typing import Dict
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute

from config import REGION, SECTION_TABLE_NAME
from response import ok


def get(event, _context) -> Dict:
    """Get a list of sections for a specific course."""
    path: Dict[str, str] = event["pathParameters"]
    class_: str = path["class"]
    data = []
    for section in Section.query(class_, Section.type_ == "section"):
        item = {"major": section.major, "name": section.name, "video": section.video}
        if section.minor is not None:
            item["minor"]: int = section.minor
        if section.detail is not None:
            item["detail"]: int = section.detail
        if section.timestamp is not None:
            item["timestamp"]: int = section.timestamp
        data.append(item)
    return ok(data)


class Section(Model):
    """pynamodb model for a section."""

    class Meta:
        """Information about the table to use."""

        table_name = SECTION_TABLE_NAME
        region = REGION

    course = UnicodeAttribute(hash_key=True)
    id_ = UnicodeAttribute(range_key=True, attr_name="id")
    type_ = UnicodeAttribute(range_key=True, attr_name="type")
    major = NumberAttribute()
    minor = NumberAttribute(null=True)
    detail = NumberAttribute(null=True)
    name = UnicodeAttribute()
    video = UnicodeAttribute()
    timestamp = UnicodeAttribute(null=True)
