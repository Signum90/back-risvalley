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
        .isString().isLength({ max: 250 }).withMessage('El campo nombre debe tener como máximo 250 caracteres'),
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
}

module.exports = ClasesValidator;