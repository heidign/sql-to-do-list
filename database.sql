-- weekend-to-do-app
-- create table
CREATE TABLE todo (
	"id" serial primary key,
	"task" varchar(180) not null,
	"isComplete" boolean not null,
	"timeCompleted" date
);

-- insertion example
INSERT INTO todo ("task", "isComplete")
VALUES ('Submit Job Application', false);