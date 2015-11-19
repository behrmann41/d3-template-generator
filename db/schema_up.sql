DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial primary key,
  email varchar(50),
  password varchar(100)
);
