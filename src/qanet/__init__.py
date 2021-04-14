def main():
    """This is required for alembic migration to pick the models"""
    try:
        from qanet.auth.models import QanetUser  # noqa lgtm[py/unused-import]
        from qanet.post_tag.models import PostTag  # noqa lgtm[py/unused-import]
        from qanet.post.models import Post  # noqa lgtm[py/unused-import]
    except Exception as e:
        print("Error occurred in migrations")
        print(e)


main()
