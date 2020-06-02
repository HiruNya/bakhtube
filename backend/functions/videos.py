"""Resource responsible for video-related handlers."""

from pynamodb.attributes import UnicodeAttribute
from pynamodb.models import Model
from pynamodb.exceptions import DoesNotExist
from typing import Dict

from config import VIDEO_TABLE_NAME, REGION
from response import not_found, ok


def get_video(event, callback) -> Dict:
    path: Dict[str, str] = event["pathParameters"]
    class_: str = path["class"]
    uuid: str = path["id"]
    try:
        video: Video = Video.get(hash_key=class_, range_key=uuid)
    except DoesNotExist:
        return not_found()
    data = {"id": video.id_}
    if video.subtitles is not None:
        data["subtitles"] = video.subtitles
    if video.internal is not None:
        data["internal"] = video.internal
    if video.next is not None:
        data["next"] = video.next
    if video.previous is not None:
        data["next"] = video.previous
    return ok(data)


class Video(Model):
    """pynamodb model for a video."""
    class Meta:
        """Information about the table to use."""
        table_name = VIDEO_TABLE_NAME
        region = REGION

    course = UnicodeAttribute(hash_key=True)
    id_ = UnicodeAttribute(range_key=True, attr_name="id")
    internal = UnicodeAttribute(null=True)
    subtitles = UnicodeAttribute(null=True)
    next = UnicodeAttribute(null=True)
    previous = UnicodeAttribute(null=True)
