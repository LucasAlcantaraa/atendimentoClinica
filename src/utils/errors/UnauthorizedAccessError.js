class UnauthorizedAccess extends Error {

  constructor(message) {
    super(message);
    this.name = 'UnauthorizedAccess';
  }

}

module.exports = UnauthorizedAccess;
