import datetime

from typing import List, Optional

from qanet.auth.models import UserRead
from qanet.comment.models import CommentRead
from qanet.models import QanetBase


class AnswerBase(QanetBase):
    content: str


class AnswerCreate(AnswerBase):
    pass


class AnswerRead(AnswerCreate):
    id: int
    points: Optional[int]

    close_votes: Optional[int]
    closed_by: Optional[UserRead]

    created_date: datetime.datetime
    modified_date: datetime.datetime
    owner: UserRead
    last_editor: UserRead

    comments: List[CommentRead]
