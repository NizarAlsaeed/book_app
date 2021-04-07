
CREATE TABLE authors (id SERIAL PRIMARY KEY, name VARCHAR(255));

/*inster unique values from table books/column author TO table author/column name*/
INSERT INTO authors(name) SELECT DISTINCT author FROM books;

/*adding a new column inside books table*/
ALTER TABLE books ADD COLUMN author_id INT;

/*for each author copy the id from author table to books authoe_is table*/
UPDATE books SET author_id=author.id FROM (SELECT * FROM authors) AS author WHERE books.author = author.name;


ALTER TABLE books DROP COLUMN author;

/*adds foreign key to books table based on the primary key from authors table which is id*/
ALTER TABLE books ADD CONSTRAINT fk_authors FOREIGN KEY (author_id) REFERENCES authors(id); 
