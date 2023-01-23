const { verificarCamposVazios } = require('../../utils/easy');

class ModeloBase {

  construirModelo(objeto) {
    this.verificarCampos(objeto);
    for (let atr in this) {
      this[atr] = objeto[atr];
    }
  }

  verificarCampos(objeto) {
    verificarCamposVazios(objeto, Object.keys(this));
  }

  getObjeto() {
    const objetoFormatado = new Object();
    for (let atr in this) {
      let valor = this[atr];

      if (typeof valor === 'number') {
        valor = valor.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      } else if (valor === null) {
        valor = '';
      }
      objetoFormatado[atr] = valor;
    }
    return objetoFormatado;
  }

}

module.exports = ModeloBase;
