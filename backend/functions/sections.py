"""Resposible for getting and creating sections in the database."""

from typing import Dict
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute

from util import ok, response


def get(_event, _context) -> Dict:
    """Get a list of sections for a specific course."""
    data = []
    for section in Section.query(hash_key="softeng250"):
        item = {}
        item["major"]: int = section.major
        item["name"]: int = section.name
        if section.minor is not None:
            item["minor"]: int = section.minor
        if section.detail is not None:
            item["detail"]: int = section.detail
        data.append(item)
    return ok(data)


class Section(Model):
    """pynamodb model for a section."""

    class Meta:
        """Information about the table to use."""

        table_name = "sectionTable"
        region = "ap-southeast-2"
    course = UnicodeAttribute(hash_key=True)
    type_ = UnicodeAttribute(range_key=True, attr_name="type")
    major = NumberAttribute()
    minor = NumberAttribute(null=True)
    detail = NumberAttribute(null=True)
    name = UnicodeAttribute()
