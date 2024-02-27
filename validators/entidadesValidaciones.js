const { body, validationResult, check } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

class EntidadesValidator {

  static async validateUniqueName(nombre) {
    const exists = await validateFieldUnique('entidad', 'nombre', nombre);
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }

  static async validateExistsUser(id) {
    const exists = await validateExistId('user', id);
    if (!exists) return Promise.reject('Id user no válido');
    const existResponsible = await validateFieldUnique('entidad', 'idUserResponsable', id);
    if (existResponsible) return Promise.reject('El usuario ya tiene una entidad a su cargo');
  }

  static async validateExitsType(tipo) {
    const exists = await validateExistId('tipo', tipo);
    if (!exists) return Promise.reject('Tipo no válido');
  }

  static get entidadesValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres')
        .custom(EntidadesValidator.validateUniqueName),
      check('idUser').notEmpty().withMessage(customMessages.required)
        .isInt()
        .custom(EntidadesValidator.validateExistsUser),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo descripcion debe tener como máximo 80 caracteres'),
      check('sigla').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 10 }).withMessage('El campo sigla debe tener como máximo 10 caracteres'),
      check('tipo').notEmpty().withMessage(customMessages.required)
        .isInt({ min: 1, max: 3 }).withMessage('El campo debe ser un número entre 1 y 3'),
      check('idTipoNaturalezaJuridica').notEmpty()
        .isInt().withMessage(customMessages.int)
        .custom(EntidadesValidator.validateExitsType),
      check('email').trim().notEmpty().withMessage(customMessages.required)
        .isEmail().withMessage(customMessages.email)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo email debe tener como máximo 80 caracteres'),
      check('telefono').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .isLength({ max: 11 }).withMessage('El campo telefono debe tener como máximo 11 caracteres'),
      check('direccion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo direccion debe tener como máximo 80 caracteres'),
      check('urlDominio').trim()
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo urlDominio debe tener como máximo 80 caracteres'),
      check('urlFacebook').trim()
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo urlFacebook debe tener como máximo 80 caracteres'),
      check('urlTwitter').trim()
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo urlTwitter debe tener como máximo 80 caracteres'),
      check('urlLinkedin').trim()
        .isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('El campo urlLinkedin debe tener como máximo 80 caracteres'),
      Middlewares.scan_errors
    ];
  }
}

module.exports = EntidadesValidator;