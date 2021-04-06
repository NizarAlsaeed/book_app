'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
// Application Middleware
app.use(express.urlencoded({ extended: true }));
// Set the view engine for server-side templating
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

client.connect().then(()=>{
    app.listen(PORT,()=>console.log('App is running on Port:',PORT ));
});

//------------------------------------------------------------------------
app.get('/',(req,res)=>{
    const SQL = 'SELECT * FROM books';
    client.query(SQL).then(result=>{
        res.render('pages/index',{result:result.rows});
    });
});

app.get('/books/:id',(req,res)=>{
    const SQL = 'SELECT * FROM books WHERE id=$1';
    const values=[req.params.id];
    console.log('req.params.id', req.params.id);
    client.query(SQL,values).then(result=>{
        res.render('pages/books/show',{result:result.rows});
    });
});

app.get('/searches/new',(req,res)=>res.render('pages/searches/new'));


app.post('/searches/new',(req,res)=>{
    let data = req.body.search;
    let url = `https://www.googleapis.com/books/v1/volumes?q=`;
    data[1]==='title'?url+=`+intitle:${data[0]}`:url+=`+inauthor:${data[0]}`;
    superagent.get(url).then(result=>{

        let bookInfo = result.body.items.map(obj=>{
            console.log('obj', obj);

            return new Book(obj);
        });
        res.render('pages/searches/show',{bookInfo:bookInfo});
    });
});


app.post('/books',(req,res)=>{
    let data = req.body.save;
    const SQL = 'INSERT INTO books (title,author,isbn,image_url,description)VALUES($1,$2,$3,$4,$5) RETURNING *';
    let values=data;
    client.query(SQL,values).then(result=>{
        console.log('rendered');
        res.render('pages/books/show',{result:result.rows});
    });
});

app.post('/edit/:id',(req,res)=>{
    let data = req.body.edit;
    let id = req.params.id;
    console.log('id', id);
    console.log('data', data);
    const SQL = `UPDATE books SET title=$1,author=$2,isbn=$3,image_url=$4,description=$5 WHERE id = ${id}  RETURNING *`;
    let values=data;
    client.query(SQL,values).then(result=>{
        console.log('edited');
        res.render('pages/books/show',{result:result.rows});
    });
});

app.post('/delete/:id',(req,res)=>{
    let id = req.params.id;
    console.log('id', id);
    const SQL = `DELETE FROM books WHERE id = ${id}`;
    client.query(SQL).then(result=>{
        console.log('deleted');
        res.redirect('/');
    });
});

app.get('*',(req,res)=>res.render('pages/error'));

//----------------------------------------------------------------------

function Book(obj){
    this.title = obj.volumeInfo.title;
    this.author = obj.volumeInfo.authors?obj.volumeInfo.authors.join(' and '):'Unknown Author';
    this.isbn = obj.volumeInfo.industryIdentifiers?obj.volumeInfo.industryIdentifiers[0].identifier:'ISBN Not available';
    this.image_url=obj.volumeInfo.imageLinks?obj.volumeInfo.imageLinks.thumbnail:'https://i.imgur.com/J5LVHEL.jpg';
    this.description=obj.volumeInfo.description||'Description Not available';
}


