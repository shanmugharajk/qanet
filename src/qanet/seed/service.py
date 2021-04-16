import os

from sqlalchemy.orm import Session

from sqlalchemy_utils import database_exists, create_database, drop_database

from alembic.config import Config
from alembic import command

from qanet.comment.models import Comment
from qanet import config
from qanet.enums import PostType
from qanet.database.core import get_db
from qanet.auth.service import create
from qanet.auth.models import UserRegister
from qanet.post_tag.models import PostTag
from qanet.post.models import Post

USER_ID = "sherlock"


def init_db():
    if database_exists(config.SQLALCHEMY_DATABASE_URI):
        drop_database(config.SQLALCHEMY_DATABASE_URI)
        print("\n[INFO] existing database dropped...")

    create_database(config.SQLALCHEMY_DATABASE_URI)
    print("\n[INFO] database created...")

    print("\n[INFO] runnning migrations...\n")
    alembic_cfg = Config(f"{os.getcwd()}/{config.ALEMBIC_INI_PATH}")
    command.upgrade(alembic_cfg, "head")
    print("\n[INFO] migrations complted...")


def create_users():
    print("\n[INFO] creating users...")

    db_session: Session = next(get_db())
    user_in = UserRegister(id=USER_ID, email="email@mail.com", password="sherlock@123")
    create(db_session=db_session, user_in=user_in)

    print("[INFO] creating users completed...")


def create_post_tags(user_id=USER_ID):
    print("\n[INFO] creating post tags...")

    db_session: Session = next(get_db())

    # python
    post_tag = PostTag()
    post_tag.id = "python"
    post_tag.description = "Python is an interpreted, high-level and general-purpose programming language. Python's design philosophy emphasizes code readability with its notable use of significant indentation."

    post_tag.owner_user_id = user_id
    post_tag.last_editor_user_id = user_id

    db_session.add(post_tag)

    # go
    post_tag = PostTag()
    post_tag.id = "go"
    post_tag.description = "Go is a statically typed, compiled programming language designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson."

    post_tag.owner_user_id = user_id
    post_tag.last_editor_user_id = user_id

    db_session.add(post_tag)

    # elixir
    post_tag = PostTag()
    post_tag.id = "elixir"
    post_tag.description = "Elixir is a functional, concurrent, general-purpose programming language that runs on the BEAM virtual machine used to implement the Erlang programming language."

    post_tag.owner_user_id = user_id
    post_tag.last_editor_user_id = user_id

    db_session.add(post_tag)
    db_session.commit()

    print("[INFO] creating post tags completed...")


def create_questions(user_id=USER_ID):
    print("\n[INFO] creating questions...")

    db_session: Session = next(get_db())

    for idx in range(1, 41):
        question = Post()
        question.title = f"{idx} How to limit the rows in loading related entities SQLAlchemy"
        question.content = "session.query(Parent).options(joinedload(Parent.children)).all()"
        question.owner_user_id = user_id
        question.last_editor_user_id = user_id

        db_session.add(question)

    db_session.commit()

    print("[INFO] creating questions completed...")


def create_answers(user_id=USER_ID, post_id=1):
    print("\n[INFO] creating answers...")

    db_session: Session = next(get_db())

    for idx in range(1, 41):
        answer = Post()
        answer.parent_id = post_id
        answer.content = f"{idx} The other, and possibly more common way to configure loading strategies is to set them up on a per-query basis against specific attributes using the Query.options() method."
        answer.post_type = PostType.answer
        answer.owner_user_id = user_id
        answer.last_editor_user_id = user_id

        db_session.add(answer)

    db_session.commit()

    print("[INFO] creating answers completed...")


def create_comments(user_id=USER_ID, post_id=80):
    print("\n[INFO] creating comments...")

    db_session: Session = next(get_db())

    for idx in range(1, 41):
        comment = Comment()
        comment.post_id = post_id
        comment.content = f"{idx} please refer the docs"
        comment.owner_user_id = user_id
        comment.last_editor_user_id = user_id

        db_session.add(comment)

    db_session.commit()

    print("\n[INFO] creating comments completed...")
