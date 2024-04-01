const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');

class ClasesValidator {
  static async validateExitsSesion(id) {
    const exists = await validateExistId('sesion', id)
    if (!exists) return Promise.reject('Id sesión no válido');
  }
  static async validateExitsClass(id) {
    const exists = await validateExistId('clase', id)
    if (!exists) return Promise.reject('Id clase no válido');
  }

  static get postClassValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('file').custom(async (file, { req }) => {
        const imageFormat = [
          'video/mp4',
          'video/mpeg',
          'video/x-msvideo',
          'video/x-matroska',
        ];
        if (!req.file) return Promise.reject('El video de la clase es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un formato de video válido');
      }),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 250 }).withMessage('El campo descripción debe tener como máximo 250 caracteres'),
      check('idCursoSesion').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int).custom(ClasesValidator.validateExitsSesion),
      Middlewares.scan_errors
    ]
  }

  static get validateIdClass() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idClase').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int).custom(ClasesValidator.validateExitsClass),
      Middlewares.scan_errors
    ]
  }

  static get updateFieldClass() {
    const customMessages = CustomMessages.getValidationMessages();

    const validations = {
      'nombre': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      'descripcion': check('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 250 }).withMessage('El campo descripción debe tener como máximo 250 caracteres'),
      'estado': check('value').trim().notEmpty().withMessage(customMessages.required).isInt({ min: 0, max: 1 }).withMessage('El estado debe ser un numero entre 1 y 0'),
    }
    return [
      param('idClase').trim().notEmpty().withMessage(customMessages.required).custom(ClasesValidator.validateExitsClass),
      body('value').custom(async (id, { req }) => {
        const validate = validations[req.body.campo]
        if (!validate) return Promise.reject('Campo no válido');
        await validate.run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return Promise.reject('error');
      }),
      Middlewares.scan_errors
    ]
  }

  static get updateFileValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idClase').trim().notEmpty().withMessage(customMessages.required).custom(ClasesValidator.validateExitsClass),
      check('file').custom(async (file, { req }) => {
        const imageFormat = [
          'video/mp4',
          'video/mpeg',
          'video/x-msvideo',
          'video/x-matroska',
        ];
        if (!req.file) return Promise.reject('El video de la clase es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un formato de video válido');
      }),
      Middlewares.scan_errors
    ]
  }
}

module.exports = ClasesValidator;