from typing import Optional
import bcrypt
from datetime import datetime, timedelta

from pydantic import validator
from jose import jwt

from sqlalchemy import Binary, Column, Integer, String
from sqlalchemy_utils import TSVectorType

from qanet.models import TimeStampMixin, QanetBase
from qanet.enums import UserRoles
from qanet.database.core import Base

from qanet.config import (
    QANET_JWT_SECRET,
    QANET_JWT_ALG,
    QANET_JWT_EXP,
)


def hash_password(password: str):
    """Generates a hashed version of the provided password."""
    pw = bytes(password, "utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw, salt)


class QanetUser(Base, TimeStampMixin):
    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    password = Column(Binary, nullable=False)
    role = Column(Integer, nullable=False, default=UserRoles.user)
    points = Column(Integer, default=0)

    # full text search capabilities
    search_vector = Column(TSVectorType("id", "email", weights={"id": "A", "email": "B"}))

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password)

    @property
    def token(self):
        now = datetime.utcnow()
        exp = (now + timedelta(seconds=QANET_JWT_EXP)).timestamp()
        data = {"exp": exp, "email": self.email, "role": self.role}
        return jwt.encode(data, QANET_JWT_SECRET, algorithm=QANET_JWT_ALG)


class UserBase(QanetBase):
    id: str

    @validator("id")
    def id_required(cls, v):
        if not v:
            raise ValueError("Must not be empty string and must be a id")
        return v


class UserLogin(UserBase):
    password: str

    @validator("password")
    def password_required(cls, v):
        if not v:
            raise ValueError("Must not be empty string")
        return v


class UserRegister(UserLogin):
    email: str
    password: Optional[str]

    @validator("email")
    def email_required(cls, v):
        if not v:
            raise ValueError("Must not be empty string and must be a email")
        return v

    @validator("password", pre=True, always=True)
    def password_hashed(cls, v):
        password = v
        return hash_password(password)


class UserLoginResponse(QanetBase):
    token: Optional[str]


class UserRead(UserBase):
    email: str
    points: int


class UserUpdate(QanetBase):
    id: str
    role: Optional[UserRoles]
    password: Optional[str]

    @validator("password", pre=True, always=True)
    def hash(cls, v):
        return hash_password(str(v))


class UserRegisterResponse(QanetBase):
    id: str
    email: str
