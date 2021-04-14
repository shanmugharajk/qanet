from sqlalchemy.orm import Session
from .models import PostTagCreate, PostTag


def get(*, db_session: Session, post_id: str):
    """Gets the PostTag by id"""
    return db_session.query(PostTag).filter(PostTag.id == post_id).one_or_none()


def create(*, db_session: Session, current_user: str, new_post: PostTagCreate) -> PostTag:
    """Creates a new Qanet user."""
    post_tag = PostTag(**new_post.dict())

    post_tag.owner_user_id = current_user
    post_tag.last_editor_user_id = current_user

    db_session.add(post_tag)
    db_session.commit()
    return post_tag
