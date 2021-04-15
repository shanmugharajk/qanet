from . import service


def main():
    service.init_db()
    service.create_users()
    service.create_post_tags()
    service.create_questions()
    service.create_answers()
    service.create_comments()
