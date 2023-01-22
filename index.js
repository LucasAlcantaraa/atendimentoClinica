const app = require('./src/config/server');
const port = process.env.PORT || '3000'
require('./src/database/tabelas')
const routes = require('./src/routes/login')
const {exeQuery, exeRawQuery, createTables} = require('./src/database/queries')
const configDB = require('./src/database/config')
// createTables(configDB)


app.use('/', routes)




app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
