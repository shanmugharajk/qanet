from fastapi import APIRouter, Depends, HTTPException

from starlette.requests import Request

from sqlalchemy.orm import session
from sqlalchemy.exc import IntegrityError

from qanet.database.core import get_db

from .models import PostTag, PostTagCreate, PostTagRead
from .service import create


authenticated_post_tags_router = APIRouter()


@authenticated_post_tags_router.post("", response_model=PostTagRead)
def create_post_tag(
    request: Request,
    post_tag: PostTagCreate,
    db_session: session = Depends(get_db),
) -> PostTag:
    try:
        return create(db_session=db_session, current_user=request.state.user.id, new_post=post_tag)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="A post tag already exists with this name.")
