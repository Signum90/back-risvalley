const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');

class BibliotecaValidator {

  static async validateIdFile(id) {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }

  static get updateStateValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get createLibraryValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      check('file').custom(async (file, { req }) => {
        const imageFormat = ['application/pdf'];
        if (!req.file) return Promise.reject('El archivo es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un pdf válido');
      }),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 80 caracteres'),
      check('autor').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
      Middlewares.scan_errors
    ]
  }
  static get updateLibraryFile() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'nombre': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      'descripcion': check('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 80 caracteres'),
      'autor': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
    }

    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      body('value').notEmpty().withMessage(customMessages.required).custom(async (id, { req }) => {
        const validate = validations[req.body.campo]
        if (!validate) return Promise.reject('Campo no válido');
        //ejecuta la validacion encontrada
        await validate.run(req);
        const errors = validationResult(req);
        //comprueba si hay errores y los retorna
        if (!errors.isEmpty()) return Promise.reject('error');
      }),
      Middlewares.scan_errors
    ]
  }
  static get updateFilesLibrary() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      check('file').custom(async (file, { req }) => {
        const imageFormat = ['application/pdf'];
        if (!req.file) return Promise.reject('El archivo es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un pdf válido');
      }),
      Middlewares.scan_errors
    ]
  }
  static get deleteFileValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      query('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

}

module.exports = BibliotecaValidator;