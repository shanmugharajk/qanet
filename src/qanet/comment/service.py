from sqlalchemy.orm import Session

from .models import Comment, CommentRead


def create(*, db_session: Session, current_user: str, post_id: int, comment_in: CommentRead):
    """Create new Comment"""
    comment = Comment(**dict(comment_in))

    comment.post_id = post_id
    comment.owner_user_id = current_user
    comment.last_editor_user_id = current_user

    db_session.add(comment)
    db_session.commit()
