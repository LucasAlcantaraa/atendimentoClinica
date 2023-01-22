const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const { EmptyResultError, ValidationError } = require("sequelize");

router.post('/auth', async function (request, response, next) {

  const usuario = {
    username: request.body.username,
    password: request.body.password
  }
  try {
    if (usuario.username && usuario.password) {
      const results = await exeQuery(`SELECT * FROM usuarios WHERE login = '${usuario.username}'`, configDB)
      if (results.length > 0) {

        verificarSenha(usuario, results[0])

        request.session.loggedin = true;
        request.session.username = usuario.username;

        response.redirect('/home');
      } else {
        response.send('Incorrect Username and/or Password!');
      }
      response.end();

    } else {
      response.send('Please enter Username and Password!');
      response.end();
    }

  } catch (error) {
    next(error)
  }

});

router.route('/').get(async function (req, res) {
  const session = req.session.loggedin

  if (session)
    res.redirect('/home')
  else
    res.render('login')
});

router.get('/home', function (req, res) {
  const session = req.session.loggedin

  if (session)
    res.render('home')
  else
    res.redirect('/')
});


function verificarSenha(usuario, resultado) {
  console.log(md5(usuario.password))
  console.log(resultado.SENHA)
  if (md5(usuario.password) !== resultado.SENHA) {
    throw new ValidationError('A senha não confere');
  }

}



// app.get('/login', function(req,res){

// res.render('login')
// });

module.exports = router;


