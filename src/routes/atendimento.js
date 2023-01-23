const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables, getData } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const { EmptyResultError, ValidationError } = require("sequelize");


let servicoEscolhido = [];

router.post('/', async function (req, res) {
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


router.post('/finalizarAtendimento', async function (req, res) {
    const idCliente = req.session.idDB
    const data = new Date();
    let dados = {
        somaValor: req.body.somaValor,
        somaMinuto: req.body.somaMinuto
    }
    let dataFormatada = data.toISOString().slice(0, 19).replace('T', ' ');
    dados = dadosFormatado(dados);

    console.log(servicoEscolhido)
    const id = await exeQuery(`insert into atendimentos (data,cliente_id,status, tempoexecucao, valortotal) values('${dataFormatada}',${idCliente}, 'Não Iniciado', '${dados.somaMinuto}', '${dados.somaValor}') RETURNING id`, configDB)
    servicoEscolhido.map(async function (elementos) {
        await exeRawQuery(`insert into atendimentos_servicos (servico_id,atendimento_id) values('${elementos.ID}',${id[0].ID})`, configDB)
    });
    servicoEscolhido = [];
    res.redirect('/andamento')
});

function dadosFormatado(dados){
const minutos = dados.somaMinuto.split(' ')
let somaMinuto = minutos[0]
const somaValor = dados.somaValor.split('R$').join('').split(',').join('.')

return dados = {
    somaMinuto,
    somaValor
}
}


module.exports = router;


