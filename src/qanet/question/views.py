from typing import List
from fastapi import APIRouter, Depends
from starlette.requests import Request

from sqlalchemy.orm import Session

from qanet.database.core import get_db
from qanet.answer import models as answer_models, service as answer_service
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
    question_in: QuestionCreate,
    db_session: Session = Depends(get_db),
) -> Post:
    return create(
        db_session=db_session, current_user=request.state.user.id, question_in=question_in
    )


@authenticated_questions_router.post(
    "/{question_id}/answers/add", response_model=answer_models.AnswerRead
)
def create_answer(
    request: Request,
    question_id: int,
    answer_in: answer_models.AnswerCreate,
    db_session: Session = Depends(get_db),
):
    return answer_service.create(
        db_session=db_session,
        current_user=request.state.user.id,
        question_id=question_id,
        answer_in=answer_in,
    )
