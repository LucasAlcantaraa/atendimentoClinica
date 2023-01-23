const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables, getData } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const { EmptyResultError, ValidationError } = require("sequelize");


router.get('/', async function (req, res) {
    const session = req.session.loggedin
    const tag = req.session.tag
    if (session){
        try{
            const resultado = await exeQuery(`
            select t.*, c.nome from atendimentos t
            inner join clientes c on c.id= t.cliente_id
             `, configDB)

             resultado.TAG = tag
             
             res.render('andamentos',{atendimentos:resultado})
        }catch (error){
            console.log(error)
        }

    }else{
        res.redirect('/')
    }
        
});






module.exports = router;


