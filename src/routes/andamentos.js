const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables, getData } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const { EmptyResultError, ValidationError } = require("sequelize");




router.get('/', async function (req, res) {
    const valor = {
        id: req.body.id
    }
    const servico = await exeQuery(`select * from servicos where id = '${valor.id}'`, configDB)

    servicoEscolhido.push(servico[0])
    res.redirect('/atendimento')
});

router.get('/', function (req, res) {
    const session = req.session.loggedin

    if (session)
        res.render('atendimentos', { servicos: servicoEscolhido })
    else
        res.redirect('/')
});






module.exports = router;


