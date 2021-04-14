import datetime
from typing import List, Optional

from qanet.models import QanetBase
from qanet.comment.models import CommentRead
from qanet.auth.models import UserRead
from qanet.post_tag.models import PostTagBase


class QuestionBase(QanetBase):
    title: str
    content: str


class QuestionCreate(QuestionBase):
    title: str
    tags: List[str]


class QuestionRead(QuestionBase):
    id: Optional[int]
    tags: List[PostTagBase]
    points: Optional[int]

    close_votes: Optional[int]
    closed_by: Optional[UserRead]

    bookmarks_count: int
    answers_count: int
    accepted_answer_id: Optional[int]

    created_date: datetime.datetime
    modified_date: datetime.datetime
    owner: UserRead
    last_editor: UserRead

    comments: List[CommentRead]
