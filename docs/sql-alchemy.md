# SQLAlchemy

Useful snippets for formulating SQLAlchemy queries.

## To Print the SQL statements

For subquery

```py
subq = (
    db_session.query(Comment)
    .filter(Comment.post_id == Post.id)
    .order_by(Comment.id.desc())
    .limit(5)
    .subquery()
    .lateral()
)

print(subq.compile(compile_kwargs={"literal_binds": True}))
```

For query object

```py
q = (
    db_session.query(Post)
    .outerjoin(subq)
    .options(contains_eager(Post.comments, alias=subq))
    .filter(Post.post_type == PostType.question)
    .order_by(Post.id.desc())
    .limit(10)
)

print(q.statement.compile(dialect=postgresql.dialect(), compile_kwargs={"literal_binds": True}))
```
