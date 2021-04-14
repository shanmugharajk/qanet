from typing import List
from fastapi import APIRouter, Depends
from starlette.requests import Request

from sqlalchemy.orm import Session

from qanet.database.core import get_db
from qanet.post.models import Post

from .models import QuestionCreate, QuestionRead
from .service import create, get_all

authenticated_questions_router = APIRouter()
questions_router = APIRouter()


@questions_router.get("", response_model=List[QuestionRead])
def get_questions(db_session: Session = Depends(get_db)):
    return get_all(db_session=db_session)


@authenticated_questions_router.post("/add", response_model=QuestionRead)
def create_question(
    request: Request,
    question: QuestionCreate,
    db_session: Session = Depends(get_db),
) -> Post:
    return create(db_session=db_session, current_user=request.state.user.id, question_in=question)
