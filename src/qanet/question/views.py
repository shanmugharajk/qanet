from typing import Optional
from fastapi import APIRouter, Depends
from starlette.requests import Request

from sqlalchemy.orm import Session

from qanet.models import CursorPaginate
from qanet.database.core import get_db
from qanet.answer import models as answer_models, service as answer_service
from qanet.post.models import Post

from .models import QuestionCreate, QuestionRead
from .service import create, get

authenticated_questions_router = APIRouter()
questions_router = APIRouter()


@questions_router.get("", response_model=CursorPaginate[QuestionRead], tags=["questions"])
def get_questions(
    cursor: Optional[int] = 0,
    item_per_page: Optional[int] = 50,
    db_session: Session = Depends(get_db),
):
    return get(db_session=db_session, cursor=cursor, item_per_page=item_per_page)


@questions_router.get(
    "/{question_id}/answers",
    response_model=CursorPaginate[answer_models.AnswerRead],
    tags=["answers"],
)
def get_answers(
    question_id: int,
    cursor: Optional[int] = 0,
    item_per_page: Optional[int] = 50,
    db_session: Session = Depends(get_db),
):
    return answer_service.get(
        db_session=db_session, cursor=cursor, item_per_page=item_per_page, question_id=question_id
    )


@authenticated_questions_router.post("/add", response_model=QuestionRead, tags=["questions"])
def create_question(
    request: Request,
    question_in: QuestionCreate,
    db_session: Session = Depends(get_db),
) -> Post:
    return create(
        db_session=db_session, current_user=request.state.user.id, question_in=question_in
    )


@authenticated_questions_router.post(
    "/{question_id}/answers/add", response_model=answer_models.AnswerRead, tags=["answers"]
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
