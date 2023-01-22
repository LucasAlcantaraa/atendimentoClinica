const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')
app.use(express.static("public"));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));
  
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});


module.exports = app