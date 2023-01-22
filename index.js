const app = require('./src/config/server');
const port = process.env.PORT || '3000'
require('./src/database/tabelas')
const routes = require('./src/routes/login')
const { exeQuery, exeRawQuery, createTables } = require('./src/database/queries')
const configDB = require('./src/database/config')
const Sequelize = require('sequelize');
const servicos = require('./src/services/servicos')

verificarTabelasBanco();

app.use('/', routes)










app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


async function verificarTabelasBanco() {
    const db = new Sequelize(configDB);
    try {
        const [results, metadata] = await db.query('select * from usuarios LIMIT 1');
    } catch {
        await createTables(configDB)
            .then( () => {
                exeRawQuery(`insert into usuarios (login, senha) values ('cliente', '698dc19d489c4e4db73e28a713eab07b')`, configDB)
                insertServicos(servicos);
            });
    }

    await db.close()
}

  async function insertServicos(servicos){
  
    await servicos.forEach(element => {
       exeRawQuery(`insert into servicos (nome,valor,tempoexecucao,descricao,googleicon) 
       values ('${element.nome}', '${element.valor}', '${element.tempoexecucao}','${element.descricao}','${element.googleicon}')`, configDB)
    });

}