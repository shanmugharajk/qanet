from typing import List, Optional

from qanet.models import QanetBase
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
    owner: UserRead
    last_editor: UserRead


class QuestionsList(QuestionRead):
    votes: int
    answers_count: int
    accepted_answer_id: int
