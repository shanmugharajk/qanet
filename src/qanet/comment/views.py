from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException

from starlette.requests import Request

from qanet.database.core import get_db
from qanet.post import service as post_service

from .models import Comment, CommentCreate, CommentRead
from .service import create

authenticated_comments_router = APIRouter()
comments_router = APIRouter()


@authenticated_comments_router.post("/{post_id}/comments/add", response_model=CommentRead)
def create_comment(
    request: Request, post_id: int, comment_in: CommentCreate, db_session: Session = Depends(get_db)
) -> Comment:
    post = post_service.get(db_session=db_session, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="The post id doest not exist.")

    return create(
        db_session=db_session,
        post_id=post_id,
        current_user=request.state.user.id,
        comment_in=comment_in,
    )
