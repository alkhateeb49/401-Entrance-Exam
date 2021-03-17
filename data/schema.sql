DROP TABLE IF EXISTS rec;
CREATE TABLE IF NOT  EXISTS rec(
    id SERIAL PRIMARY KEY,
    name varchar(250),
    date varchar(250),
    casesc varchar(250),
    casesd varchar(250),
    casesr varchar(250)
);
