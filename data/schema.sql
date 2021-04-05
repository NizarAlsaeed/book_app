Drop Table IF EXISTS books;

CREATE Table books(
    id serial,
    title varchar(250),
    author varchar(250),
    isbn varchar(50),
    image_url varchar(250),
    description text
);
