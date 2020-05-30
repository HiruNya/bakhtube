from pynamodb.attributes import UnicodeAttribute
from pynamodb.indexes import AllProjection, LocalSecondaryIndex


class TypeIndex(LocalSecondaryIndex):
    class Meta:
        index_name = "typeIndex"
        projection = AllProjection()
    type_ = UnicodeAttribute(hash_key=True, attr_name="type")
    id_ = UnicodeAttribute(range_key=True, attr_name="id")
