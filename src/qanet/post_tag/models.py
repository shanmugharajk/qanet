from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import String

from qanet.models import QanetBase, TimeStampMixin, OwnerEditorMixin
from qanet.database.core import Base


class PostTag(Base, OwnerEditorMixin, TimeStampMixin):
    id = Column(String, primary_key=True)
    description = Column(String, nullable=False)


class PostTagBase(QanetBase):
    id: str
    description: str


class PostTagCreate(PostTagBase):
    pass


class PostTagRead(PostTagBase):
    owner_user_id: str
    last_editor_user_id: str
