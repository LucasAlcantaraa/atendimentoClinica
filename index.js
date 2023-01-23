const app = require('./src/config/server');
const port = process.env.PORT || '3000'
require('./src/database/tabelas')
const routesLogin = require('./src/routes/login')
const routesAtendimento = require('./src/routes/atendimento')
const routesServico = require('./src/routes/servicos')
const routesAndamento = require('./src/routes/andamentos')
const routesFuncionario = require('./src/routes/funcionario')
const { exeQuery, exeRawQuery, createTables } = require('./src/database/queries')
const configDB = require('./src/database/config')
const Sequelize = require('sequelize');
const servicos = require('./src/services/servicos')

verificarTabelasBanco();

app.use('/', routesLogin)
app.use('/atendimento', routesAtendimento)
app.use('/servicos', routesServico)
app.use('/andamento', routesAndamento)
app.use('/staff', routesFuncionario)


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
                insertClientePadrao()
                insertFuncionarioPadrao()
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

async function insertClientePadrao(){
   const id =  await exeQuery(`insert into usuarios (login, senha) values ('cliente', '698dc19d489c4e4db73e28a713eab07b') RETURNING id`, configDB)
   await exeRawQuery(`insert into clientes (nome, user_id) values ('Usuario Teste', '${id[0].ID}')`, configDB)
}

async function insertFuncionarioPadrao(){
    const id =  await exeQuery(`insert into userFuncionarios (login, senha) values ('atendente', '698dc19d489c4e4db73e28a713eab07b') RETURNING id`, configDB)
    await exeRawQuery(`insert into funcionarios (nome, user_id) values ('Atendente Teste', '${id[0].ID}')`, configDB)
 }
 
