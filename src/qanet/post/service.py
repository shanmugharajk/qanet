from sqlalchemy.orm import Session

from .models import Post


def get(*, db_session: Session, post_id: int):
    return db_session.query(Post).filter(Post.id == post_id).one_or_none()
