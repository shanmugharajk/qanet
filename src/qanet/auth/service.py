from typing import Optional

from fastapi import HTTPException
from fastapi.params import Depends
from fastapi.security.utils import get_authorization_scheme_param

from starlette.status import HTTP_401_UNAUTHORIZED
from starlette.requests import Request

from sqlalchemy import or_
from sqlalchemy.orm.session import Session

from jose import JWTError, jwt
from jose.exceptions import JWKError

from qanet.config import QANET_JWT_SECRET
from qanet.database.core import get_db

from .models import QanetUser, UserRegister


def get_by_email_or_id(*, db_session, email_or_id: str) -> Optional[QanetUser]:
    """Returns an user object based on user email."""
    return (
        db_session.query(QanetUser)
        .filter(or_(QanetUser.id == email_or_id, QanetUser.email == email_or_id))
        .one_or_none()
    )


def create(*, db_session, user_in: UserRegister) -> QanetUser:
    """Creates a new Qanet user."""
    # pydantic forces a string password, but we really want bytes
    password = bytes(user_in.password, "utf-8")
    user = QanetUser(**user_in.dict(exclude={"password"}), password=password)
    db_session.add(user)
    db_session.commit()
    return user


def set_current_user(*, db_session: Session = Depends(get_db), request: Request) -> QanetUser:
    """
    Attempts to get the current user from JWT and sets it in request state as 'request.state.user'.
    Else throws an error with 401
    """
    authorization: str = request.headers.get("Authorization")
    scheme, param = get_authorization_scheme_param(authorization)

    if not authorization or scheme.lower() != "bearer":
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="Malformed authorization header."
        )

    token = authorization.split()[1]

    try:
        data = jwt.decode(token, QANET_JWT_SECRET)
    except (JWKError, JWTError) as e:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=str(e))

    email = data["email"]

    user = get_by_email_or_id(db_session=db_session, email_or_id=email)

    if not user:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    request.state.user = user

    return user
