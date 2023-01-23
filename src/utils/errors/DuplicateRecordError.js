class DuplicateRecordError extends Error {

  constructor(message) {
    super(message);
    this.name = 'DuplicateRecordError';
  }

}

module.exports = DuplicateRecordError;
