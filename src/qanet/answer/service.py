from sqlalchemy.orm import Session, contains_eager

from qanet.models import CursorPaginate
from qanet.enums import PostType
from qanet.comment.models import Comment
from qanet.post.models import Post

from .models import AnswerCreate, AnswerRead


def get(*, db_session: Session, question_id: int, cursor: int = 0, item_per_page: int = 50):
    """Gets Answers based on the cursor"""
    # https://stackoverflow.com/questions/43727268/limit-child-collections-in-initial-query-sqlalchemy
    subq = (
        db_session.query(Comment)
        .filter(Comment.post_id == Post.id)
        .order_by(Comment.id.desc())
        .limit(5)
        .subquery()
        .lateral()
    )

    q = db_session.query(Post).filter(
        Post.post_type == PostType.answer, Post.parent_id == question_id
    )

    total = q.count()

    q = q.outerjoin(subq)

    if cursor == 0:
        q = q.filter(Post.id > cursor)
    else:
        q = q.filter(Post.id < cursor)

    q = q.options(contains_eager(Post.comments, alias=subq)).order_by(Post.id.desc())

    return CursorPaginate[AnswerRead](
        items=q.limit(item_per_page).all(), items_per_page=item_per_page, total=total
    )


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
