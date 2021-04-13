from sqlalchemy_searchable import search as search_db

from .core import get_class_by_tablename


def search(*, db_session, query_str: str, model: str, sort=False):
    """Perform a search based on the query."""
    q = db_session.query(get_class_by_tablename(model))
    return search_db(q, query_str, sort=sort)
