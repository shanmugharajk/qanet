from datetime import datetime

from sqlalchemy import Column, DateTime, event

from pydantic import BaseModel


class QanetBase(BaseModel):
    class Config:
        orm_mode = True
        validate_assignment = True


class TimeStampMixin(object):
    """ Timestamping mixin"""

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
