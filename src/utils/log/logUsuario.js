const uuid = require('uuid');
const { exeQuery, exeRawQuery, getData } = require('../../database/queries');

exports.logarLogin = async (codigoUsuario) => {
  const novaOrdem = await gerarNovaOrdem();
  const novoToken = criarToken();

  await exeRawQuery(`
    INSERT INTO LOGUSUARIO (
      ORDEM, DATAHORA, CODIGOUSUARIO, MODULO,
      ACAO, CHAVE, MOVIMENTADO
    )
    VALUES (
      '${novaOrdem}', '${getData(null, '-', true)}', '${codigoUsuario}', 'VENDAS/WEB',
      'Login', '${novoToken}', 'F'
    )
  `);
  return novoToken;
};

function criarToken() {
  return uuid.v4();
}

// exports.inserirLog = (token, acao) => {
//   const sql = (`
//     INSERT INTO LOGUSUARIO (
//       ORDEM, DATAHORA, CODIGOUSUARIO, MODULO,
//       ACAO, TABELA, CHAVE, MOVIMENTADO
//     )
//     VALUES (

//     )
//   `);
// };

async function gerarNovaOrdem() {
  const resultados = await exeQuery(`
    SELECT MAX(ORDEM)
    FROM LOGUSUARIO
  `);
  const ultimaOrdem = parseInt(resultados[0].MAX);
  return ultimaOrdem + 1;
}
