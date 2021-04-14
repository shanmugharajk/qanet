from sqlalchemy.orm import Session

from qanet.enums import PostType
from qanet.post_tag import service as post_tag_service
from qanet.post.models import Post

from .models import QuestionCreate


def get_all(*, db_session: Session):
    """Gets all the Question"""
    return (
        db_session.query(Post)
        .filter(Post.post_type == PostType.question, Post.deleted_date.is_(None))
        .order_by(Post.id.desc())
        .all()
    )


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
