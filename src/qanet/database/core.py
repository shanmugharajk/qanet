import re
from typing import Any
from sqlalchemy import create_engine


from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.inspection import inspect


from sqlalchemy.orm import sessionmaker
from sqlalchemy_searchable import make_searchable

from qanet.config import SQLALCHEMY_DATABASE_URI


engine = create_engine(SQLALCHEMY_DATABASE_URI)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class CustomBase:
    @declared_attr
    def __tablename__(self):
        return resolve_table_name(self.__name__)

    def _asdict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


Base = declarative_base(cls=CustomBase)
make_searchable(Base.metadata)


def get_db():
    """Gives a db session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def resolve_table_name(name):
    """Resolves table names to their mapped names."""
    names = re.split("(?=[A-Z])", name)  # noqa
    return "_".join([x.lower() for x in names if x])


def get_model_name_by_tablename(table_fullname: str) -> str:
    """Returns the model name of a given table."""
    return get_class_by_tablename(table_fullname=table_fullname).__name__


def get_class_by_tablename(table_fullname: str) -> Any:
    """Return class reference mapped to table."""
    mapped_name = resolve_table_name(table_fullname)
    for c in Base._decl_class_registry.values():
        if hasattr(c, "__table__"):
            if c.__table__.fullname.lower() == mapped_name.lower():
                return c
    raise Exception(f"Incorrect tablename '{mapped_name}'. Check the name of your model.")


def get_table_name_by_class_instance(class_instance: Base) -> str:
    """Returns the name of the table for a given class instance."""
    return class_instance._sa_instance_state.mapper.mapped_table.name
