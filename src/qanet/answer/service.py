from sqlalchemy.orm import Session

from qanet.enums import PostType
from qanet.post.models import Post

from .models import AnswerCreate


def create(*, db_session: Session, current_user: str, question_id: int, answer_in: AnswerCreate):
    """Creates a new Answer"""
    answer = Post(**dict(answer_in))

    answer.parent_id = question_id

    answer.post_type = PostType.answer
    answer.owner_user_id = current_user
    answer.last_editor_user_id = current_user

    db_session.add(answer)
    db_session.commit()
    return answer
