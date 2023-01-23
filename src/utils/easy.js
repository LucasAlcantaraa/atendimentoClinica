const _ = require('lodash');
const MissingFieldError = require('../utils/errors/MissingFieldError');

const { retirarCaracteresEspeciais, preencherEsquerdaComZeros } = require('./formatacao');

exports.objetoVazio = (obj) => {
  if (Object.keys(obj).length) {
    return false;
  }
  return true;
};

exports.validarPesquisa = (params, campos, opcoes) => {
  this.verificarCamposVazios(params, campos, opcoes);
  return this.formatarPesquisa(params, opcoes);
};

exports.verificarCamposVazios = (obj, chaves, { erro }={}) => {
  if (chaves.length > 1 && !Object.keys(obj).length) {
    const mensagemErroVazio = (erro) ? erro[0] : 'Nenhum dado passado';
    throw new MissingFieldError(mensagemErroVazio);
  }
  for (let chave of chaves) {
    if (obj[chave] === undefined || (obj[chave] === "" && chave !== 'OBSERVACAO')) {
      let mensagemErroFaltando;

      if (erro) {
        mensagemErroFaltando = erro[1];
        mensagemErroFaltando = mensagemErroFaltando.replace('$', chave);
      } else {
        mensagemErroFaltando = `Falta campo obrigatório '${chave}'`;
      }
      throw new MissingFieldError(mensagemErroFaltando);
    }
  }
};

exports.formatarPesquisa = (obj, { dialeto }={}) => {
  // retorna um novo objeto com valores formatados:
  // uppercase, trim e sem acento caso db = postgres.
  const pesquisa = _.cloneDeep(obj);

  for (let atr in pesquisa) {
    let valor = pesquisa[atr];

    if (typeof valor === 'string') {
      valor = valor.trim();

      if (dialeto === 'POSTGRES') {
        valor = retirarCaracteresEspeciais(valor);
      }
    }
    pesquisa[atr] = valor;
  }
  return pesquisa;
};

exports.formatarResultados = (resultados) => {
  // deve ser usado após uma query
  // para formatar os resultados do select
  // já é usado em exeQuery
  const resultadosFormatados = [];

  resultados.forEach(obj => {
    const entriesFormatadas = Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'string') {
        v = v.trim();
      } else if (v instanceof Buffer) {
        v = v.toString('latin1');
      }
      k = k.toUpperCase();

      return [k, v];
    });
    const novoObjeto = Object.fromEntries(entriesFormatadas);
    resultadosFormatados.push(novoObjeto);
  });
  return resultadosFormatados;
};

exports.converterValoresParaString = (arrayResultados) => {
  // retorna um novo objeto com todos os valores em string
  const novo = arrayResultados.map(obj => {
    const clonado = _.cloneDeep(obj);
    return converterValores(clonado);
  });
  return novo;
};

function converterValores(obj) {
  for (let atr in obj) {
    const valor = obj[atr];

    if (typeof valor === 'number')
      obj[atr] = valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    else if (valor === null)
      obj[atr] = '';
  }
  return obj;
}

exports.retornarConsultaPaginada = (consulta) => {
  const quantidadeItensPorPagina = 5;
  const quantidadePaginas = Math.ceil(consulta.length / quantidadeItensPorPagina);

  const paginas = new Object();
  for (let pag = 1; pag <= quantidadePaginas; pag++) {

      const inicio = (pag - 1) * quantidadeItensPorPagina;
      const fim = inicio + quantidadeItensPorPagina;

      const itens = [];
      for (let i = inicio; i < fim; i++) {
          const item = consulta[i];
          if (item) {
              itens.push(consulta[i]);
          }
      }
      paginas[pag] = itens;
  }
  return paginas;
};

exports.tratarOrdem = (ordem, tamanho=10) => {
  let ordemTratada;
  if (ordem.toString().length !== tamanho)
    ordemTratada = preencherEsquerdaComZeros(ordem, tamanho);
  else
    ordemTratada = ordem;
  return ordemTratada;
};
