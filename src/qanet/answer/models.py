import datetime

from typing import Optional

from qanet.auth.models import UserRead
from qanet.models import QanetBase


class AnswerBase(QanetBase):
    content: str


class AnswerCreate(AnswerBase):
    pass


class AnswerRead(AnswerCreate):
    id: int
    points: Optional[int]
    created_date: datetime.datetime
    modified_date: datetime.datetime
    owner: UserRead
    last_editor: UserRead
