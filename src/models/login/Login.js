const ModeloBase = require("../base/ModeloBase");

class Login extends ModeloBase {

  LOGIN;
  SENHA;

  constructor(login) {
    super();
    this.construirModelo(login);
  }

}

module.exports = Login;
