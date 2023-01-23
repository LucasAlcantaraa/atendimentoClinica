const express = require('express')
const router = express.Router();
require('../config/server')
const { exeQuery, exeRawQuery, createTables } = require('../database/queries')
const configDB = require('../database/config')
const md5 = require('md5');
const { EmptyResultError, ValidationError } = require("sequelize");


router.get('/', async function (req, res) {

    const results = await exeQuery('select * from servicos', configDB)
    res.json(results)

});





module.exports = router;


