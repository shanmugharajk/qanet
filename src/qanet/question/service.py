from sqlalchemy.orm import Session

from qanet.models import CursorPaginate
from qanet.enums import PostType
from qanet.post_tag import service as post_tag_service
from qanet.post.models import Post

from .models import QuestionCreate, QuestionRead


def get(*, db_session: Session, cursor: int = 0, item_per_page: int = 50):
    """Gets Questions based on the cursor"""
    q = db_session.query(Post).filter(Post.post_type == PostType.question)

    total = q.count()

    if cursor == 0:
        q = q.filter(Post.id > cursor)
    else:
        q = q.filter(Post.id < cursor)

    items = q.order_by(Post.id.desc()).limit(item_per_page).all()

    return CursorPaginate[QuestionRead](items=items, items_per_page=item_per_page, total=total)


def create(*, db_session: Session, current_user: str, question_in: QuestionCreate):
    """Creates a new Question."""
    post = Post(**question_in.dict(exclude={"tags"}))

    tags = []

    for tag in question_in.tags:
        tags.append(post_tag_service.get(db_session=db_session, post_id=tag))

    post.tags = tags
    post.owner_user_id = current_user
    post.last_editor_user_id = current_user

    db_session.add(post)
    db_session.commit()
    return post
