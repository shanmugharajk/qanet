from sqlalchemy.orm import Session, contains_eager


from qanet.enums import PostType
from qanet.comment.models import Comment
from qanet.post_tag import service as post_tag_service
from qanet.post.models import Post

from .models import QuestionCreate


def get_all(*, db_session: Session):
    """Gets all the Question"""
    # https://stackoverflow.com/questions/43727268/limit-child-collections-in-initial-query-sqlalchemy
    subq = (
        db_session.query(Comment)
        .filter(Comment.post_id == Post.id)
        .order_by(Comment.id.desc())
        .limit(5)
        .subquery()
        .lateral()
    )

    return (
        db_session.query(Post)
        .outerjoin(subq)
        .options(contains_eager(Post.comments, alias=subq))
        .filter(Post.post_type == PostType.question)
        .order_by(Post.id.desc())
        .limit(10)
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
