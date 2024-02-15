class CustomMessages {
  static getValidationMessages() {
    return {
      required: 'El campo :field es obligatorio.',
      string: 'El campo :field debe ser un string.',
      length: 'El campo :field no debe superar los caracteres.',
      email: 'El campo :field debe ser un correo electronico válido.',
      int: 'El campo :field debe ser un numero entero',
    };
  }
};


module.exports = CustomMessages;