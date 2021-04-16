from datetime import datetime
from typing import Generic, List, TypeVar

from sqlalchemy.orm import relationship
from sqlalchemy import Column, DateTime, event, ForeignKey, String
from sqlalchemy.ext.declarative import declared_attr

from pydantic import BaseModel
from pydantic.generics import GenericModel
from humps import camelize


def to_camel(string):
    return camelize(string)


class QanetBase(BaseModel):
    class Config:
        orm_mode = True
        validate_assignment = True
        alias_generator = to_camel
        allow_population_by_field_name = True


T = TypeVar("T")


class CursorPaginate(GenericModel, Generic[T]):
    items: List[T]
    items_per_page: int
    total: int

    class Config:
        orm_mode = True
        validate_assignment = True
        alias_generator = to_camel
        allow_population_by_field_name = True


class TimeStampMixin(object):
    """Timestamping mixin"""

    created_date = Column(DateTime, default=datetime.utcnow)
    created_date._creation_order = 9998

    modified_date = Column(DateTime, default=datetime.utcnow)
    modified_date._creation_order = 9998

    @staticmethod
    def _modified_date(mapper, connection, target):
        target.modified_date = datetime.utcnow()

    @classmethod
    def __declare_last__(cls):
        event.listen(cls, "before_update", cls._modified_date)


class OwnerMixin(object):
    """Owner mixin"""

    @declared_attr
    def owner_user_id(cls):
        return Column(String, ForeignKey("qanet_user.id"))

    # For dto purpose
    @declared_attr
    def owner(cls):
        return relationship("QanetUser", lazy=True, foreign_keys=cls.owner_user_id)


class OwnerEditorMixin(OwnerMixin):
    """OwnerEditor mixin - has owner user, editor user details"""

    @declared_attr
    def last_editor_user_id(cls):
        return Column(String, ForeignKey("qanet_user.id"))

    # For dto purpose
    @declared_attr
    def last_editor(cls):
        return relationship("QanetUser", lazy=True, foreign_keys=cls.last_editor_user_id)
