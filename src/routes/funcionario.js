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
      const results = await exeQuery(`SELECT * FROM userfuncionarios WHERE login = '${usuario.username}'`, configDB)
      if (results.length > 0) {

        verificarSenha(usuario, results[0])

        request.session.loggedin = true;
        request.session.username = usuario.username;
        request.session.idDB = results[0].ID;
        request.session.tagSec = 'funcionario';
        
        response.redirect('/staff');
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
    res.redirect('/andamento')
  else
    res.render('loginFunc')
});

router.get('/logOut', async function (req, res) {
  req.session.destroy()
  req.session = null
  res.redirect('/')
});

router.get('/atendimento/:id', async function (req, res) {
 const parametros = req.params.id
 const tagSessao = req.session.tagSec
 
 if(tagSessao === 'funcionario'){

  const results = await exeQuery(`select * from atendimentos where id='${parametros}'`, configDB)

  res.render('atendimentoFuncionario', {atendimento: results})
 }else{
  res.render('você não tem permissão para visualizar esse atendimento')
 }

});

router.post('/iniciarAtendimento/:id', async function (req, res) {
  const parametros = req.params.id
  const tagSessao = req.session.tagSec
  const valor = req.body.iniciarBotao
  const idSessao = req.session.idDB
  

  const comissao = calcularComissao(parseFloat(valor))

  console.log( parametros)
  console.log( tagSessao)
  console.log( valor)

  if(tagSessao === 'funcionario'){
 
   await exeRawQuery(`update atendimentos set status= 'Em Andamento' where id='${parametros}'`, configDB)

   await exeRawQuery(`insert into atendimentos_funcionarios (funcionario_id, atendimento_id, comissao) values('${idSessao}', '${parametros}','${comissao}' )`, configDB)
 
   res.redirect('/andamento')
  }else{
   res.render('você não tem permissão para realizar esta ação')
  }
 
 });

 router.post('/finalizarAtendimento/:id', async function (req, res) {
  const parametros = req.params.id
  const tagSessao = req.session.tagSec

  if(tagSessao === 'funcionario'){
 
   await exeRawQuery(`update atendimentos set status= 'Finalizado' where id='${parametros}'`, configDB)


   res.redirect('/andamento')
  }else{
   res.render('você não tem permissão para visualizar esse atendimento')
  }
 
 });


function verificarSenha(usuario, resultado) {
  console.log(md5(usuario.password))
  console.log(resultado.SENHA)
  if (md5(usuario.password) !== resultado.SENHA) {
    throw new ValidationError('A senha não confere');
  }

}

function calcularComissao(valor){
const comissao = (15 / 100) * valor

return comissao
}


// app.get('/login', function(req,res){

// res.render('login')
// });

module.exports = router;


