SELECT
    "questions".*,
    string_agg("question_tags".tag_id, ', ') as tags,
    (SELECT count(*)
        FROM bookmarks
        WHERE bookmarks.question_id = 6 AND user_id = 'admin@123') as bookmarks
FROM "questions"
    inner join question_tags on question_tags.question_id = questions.id
WHERE ("questions".id = 1)
GROUP By 1;

insert into question_comments (comment, author_id, question_id) values ('test comment 1', 'admin@123', 1);
insert into question_comments (comment, author_id, question_id) values ('test comment 2', 'admin@123', 1);
insert into question_comments (comment, author_id, question_id) values ('test comment 3', 'admin@123', 1);
insert into question_comments (comment, author_id, question_id) values ('test comment 4', 'admin@123', 1);
insert into question_comments (comment, author_id, question_id) values ('test comment 5', 'admin@123', 1);
insert into question_comments (comment, author_id, question_id) values ('test comment 6', 'admin@123', 1);