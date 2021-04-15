from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import PrimaryKeyConstraint

from qanet.enums import PostType
from qanet.models import OwnerEditorMixin, TimeStampMixin
from qanet.database.core import Base


assoc_question_post_tags = Table(
    "assoc_question_post_tags",
    Base.metadata,
    Column("post_tag_id", String, ForeignKey("post_tag.id")),
    Column("post_id", Integer, ForeignKey("post.id")),
    PrimaryKeyConstraint("post_tag_id", "post_id"),
)


class Post(Base, OwnerEditorMixin, TimeStampMixin):
    id = Column(Integer, primary_key=True)
    post_type = Column(Integer, default=PostType.question)
    points = Column(Integer, nullable=True)
    title = Column(String, nullable=True)
    content = Column(String)
    tags = relationship("PostTag", secondary=assoc_question_post_tags, cascade="all, delete")

    parent_id = Column(Integer, ForeignKey("post.id"), nullable=True)
    answers_count = Column(Integer, default=0)
    accepted_answer_id = Column(Integer, ForeignKey("post.id"), nullable=True)

    bookmarks_count = Column(Integer, default=0)

    close_votes = Column(Integer, nullable=True)
    closed_by_user_id = Column(String, ForeignKey("qanet_user.id"), nullable=True)
    closed_date = Column(DateTime, nullable=True)
    deleted_date = Column(DateTime, nullable=True)

    closed_by = relationship("QanetUser", foreign_keys=[closed_by_user_id])
    comments = relationship("Comment", lazy="subquery")
