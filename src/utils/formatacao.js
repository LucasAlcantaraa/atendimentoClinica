exports.dataFormatada = (data=null, entre='-', hora=false) => {
  return formatarData({
    customData: data,
    entre: entre,
    addHora: hora
  });
};

exports.dataFormatadaInvertida = (data=null, entre='-', hora=false) => {
  return formatarData({
    customData: data,
    entre: entre,
    invertida: true,
    addHora: hora
  });
};

exports.dataMesPrimeiro = (data=null, entre='-', hora=false) => {
  return formatarData({
    customData: data,
    entre: entre,
    mesPrimeiro: true,
    addHora: hora
  });
};

function formatarData({ customData=null, entre='-', invertida=false, mesPrimeiro=false, addHora=false }) {
  let data;
  if (typeof customData === 'string') {
    data = new Date(customData + 'T00:00:00.000');

  } else if (customData instanceof Date) {
    if (customData.toString().includes('GMT-0300')) {
      const maisUmDia = customData.setDate(customData.getDate() + 1);
      data = new Date(maisUmDia)
    } else {
      data = customData;
    }
  } else {
    data = new Date();
  }
  const dataBR = data.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
  const arrayData = repartirData(dataBR);
  
  let retorno;
  if (invertida) {
    const dataInvertida = [arrayData[2], arrayData[1], arrayData[0]]
    retorno = dataInvertida.join(entre);

  } else if (mesPrimeiro) {
    const dataMesPrimeiro = [arrayData[1], arrayData[0], arrayData[2]];
    retorno = dataMesPrimeiro.join(entre);

  } else {
    retorno = arrayData.join(entre);
  }

  if (addHora) {
    const hora = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    retorno += ' ' + hora;
  }
  return retorno
}

function repartirData(data) {
  const dataSemHora = data.substring(0, 10);
  const dataCortada = dataSemHora.split('/');
  const dia = dataCortada[0];
  const mes = dataCortada[1];
  const ano = dataCortada[2];

  return [dia, mes, ano];
}

exports.preencherEsquerdaComZeros = (str, tamanho) => {
  str = String(str);
  if (str.length < tamanho) {
    for (let i = str.length; i < tamanho; i++) {
      str = '0' + str;
    }
  }
  return str;
};

exports.replaceCaracteresEmNumeros = (valores) => {
  if(Array.isArray(valores)) {
      return casoValorParaSubstituirSejaArray(valores);
  } else {
      return casoValorParaSubstituirSejaString(valores);
  }
}

function casoValorParaSubstituirSejaArray(valores) {
  for(let i = 0; i < valores.length; i++) {
      let valor = substituirEConverter(valores[i]);
      if (isNaN(valor)) {
          throw new Error(`Não foi possível formatar string "${valores[i]}" em array`);
      }
      valores[i] = valor;
  }
  return valores;
}

function casoValorParaSubstituirSejaString(valor) {
  if (valor.length === 0) {
      return valor;
  }

  let num = substituirEConverter(valor);
  if (isNaN(num)) {
      throw new Error(`Não foi possível formatar string "${valor}"`);
  }
  return num;
}

function substituirEConverter(num) {
  num = substituirCaracteres(num);
  num = parseFloat(num);
  return num;
}

function substituirCaracteres(valor) {
  if (valor.includes('.') && !valor.includes(',')) {
      // é o caso de strings tipo "10.0" ou "2.25"
      return valor;
  } else {
      return valor
          .split('R$').join('')
          .split('.').join('')
          .split(',').join('.');
  }
}

exports.retirarCaracteresEspeciais = (str) => {
  const especiais = `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ`;
  const correspondentes = `AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr`;

  let novaStr = '';
  for (let i = 0; i < str.length; i++) {
    let letra = str[i]

    if (especiais.includes(letra)) {
      const indexCaracter = especiais.indexOf(letra);
      letra = correspondentes[indexCaracter];
    }
    novaStr += letra;
  }
  return novaStr;
};
