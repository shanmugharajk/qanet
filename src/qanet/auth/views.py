from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import session

from qanet.database.core import get_db

from .models import UserRegister, UserRegisterResponse, UserLogin, UserLoginResponse
from .service import create, get_by_email_or_id

auth_router = APIRouter()


@auth_router.post("/register", response_model=UserRegisterResponse)
def register_user(
    user_in: UserRegister,
    db_session: session = Depends(get_db),
):
    user = get_by_email_or_id(db_session=db_session, email_or_id=user_in.email)
    if not user:
        user = create(db_session=db_session, user_in=user_in)
    else:
        raise HTTPException(status_code=400, detail="User with that email address exists.")

    return user


@auth_router.post("/login", response_model=UserLoginResponse)
def login_user(
    user_in: UserLogin,
    db_session: session.Session = Depends(get_db),
):
    user = get_by_email_or_id(db_session=db_session, email_or_id=user_in.id)
    if user and user.check_password(user_in.password):
        return {"token": user.token}

    raise HTTPException(status_code=400, detail="Invalid username or password")
