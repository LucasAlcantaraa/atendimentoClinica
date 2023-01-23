const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const {  ValidationError } = require("sequelize");

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
        request.session.idDB = results[0].ID;
        request.session.tagSec = 'cliente';
        
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

router.get('/home', async function (req, res) {
  const session = req.session.loggedin
  if (session){
    const listaServicos = await exeQuery(`select * from servicos`,configDB)
    res.render('home',{services: listaServicos})
  }
  else
    res.redirect('/')
});

router.get('/logOut', async function (req, res) {
  req.session.destroy()
  req.session = null
  res.redirect('/')
});

router.get('/cadastrar', async function (req, res) {
  res.render('cadastrar')
});

router.post('/cadastrar', async function (req, res) {
  const dados = {
    login: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  }

    if(dados.login === undefined || dados.login === ''){
      throw new ValidationError('insira um nome de usuário')
    }else if(dados.password !== dados.password2){
      throw new ValidationError('as senhas não conferem')
    }else{
      senhaMD5 = md5(dados.password)
      try{
        const cadastro = await exeQuery(`insert into usuarios (login,senha) values('${dados.login}', '${senhaMD5}') RETURNING id`, configDB)
        await exeRawQuery(`insert into clientes(nome,user_id) values('${dados.login}', '${cadastro[0].ID}')`, configDB);
      }catch (error){
        console.log(error)
      }
      res.redirect('/')
    }

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


