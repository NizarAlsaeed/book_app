'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT;
const app = express();
// Application Middleware
app.use(express.urlencoded({ extended: true }));
// Set the view engine for server-side templating
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.listen(PORT,()=>console.log('App is running on Port:',PORT ));

//------------------------------------------------------------------------
app.get('/',(req,res)=>res.render('pages/index'));
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


app.get('*',(req,res)=>res.render('pages/error'));

//----------------------------------------------------------------------

function Book(obj){
    this.title = obj.volumeInfo.title;
    this.imgLink=obj.volumeInfo.imageLinks?obj.volumeInfo.imageLinks.thumbnail:undefined||'https://i.imgur.com/J5LVHEL.jpg';
    this.description=obj.volumeInfo.description||'Description Not available';
    this.ISBN = obj.volumeInfo.industryIdentifiers[0].identifier;
    this.publishedDate = obj.volumeInfo.publishedDate;
}


