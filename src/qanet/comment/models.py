import datetime

from typing import Optional
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from qanet.auth.models import UserRead
from qanet.models import OwnerEditorMixin, TimeStampMixin, QanetBase
from qanet.database.core import Base


class Comment(Base, OwnerEditorMixin, TimeStampMixin):
    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("post.id"))
    content = Column(String)
    points: Column(Integer, nullable=True)

    close_votes = Column(Integer, nullable=True)
    closed_by_user_id = Column(String, ForeignKey("qanet_user.id"), nullable=True)
    closed_by = relationship("QanetUser", foreign_keys=[closed_by_user_id])


class CommentBase(QanetBase):
    content: str


class CommentCreate(CommentBase):
    pass


class CommentRead(CommentBase):
    id: int
    post_id: int
    points: Optional[int]
    close_votes: Optional[int]

    created_date: datetime.datetime
    modified_date: datetime.datetime
    owner: UserRead
    last_editor: UserRead
