const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');

class BibliotecaValidator {

  static async validateIdFile(id) {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }
  static async validateExitsType(tipo) {
    const exists = await validateExistId('tipo', tipo);
    if (!exists) return Promise.reject('Tipo no válido');
  }


  static get updateStateValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get detailArchivoValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      Middlewares.scan_errors
    ]
  }
  static get createLibraryValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      check('file').custom(async (file, { req }) => {
        const imagen = req.files['imagen'];
        const libro = req.files['libro'];

        const libroFormat = ['application/pdf'];
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!libro) return Promise.reject('El archivo es obligatorio');
        if (!imagen) return Promise.reject('La imagen es obligatoria');
        if (!libroFormat.includes(libro[0].mimetype)) return Promise.reject('Ingrese un pdf válido');
        if (!imageFormat.includes(imagen[0].mimetype)) return Promise.reject('Ingrese una imagen válida');
      }),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 250 }).withMessage('El campo descripcion debe tener como máximo 250 caracteres'),
      check('autor').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
      check('idCategoria').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int).custom(BibliotecaValidator.validateExitsType),
      check('tipo').trim().notEmpty().withMessage(customMessages.required)
        .isInt({ min: 1, max: 2 }).withMessage('El tipo debe ser un numero entre 1 y 2'),
      Middlewares.scan_errors
    ]
  }
  static get updateLibraryFile() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'nombre': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      'descripcion': check('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 250 }).withMessage('El campo descripcion debe tener como máximo 250 caracteres'),
      'autor': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
      'imagen': check('file').custom(async (file, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!req.file) return Promise.reject('El archivo es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese una imagen válida');
      }),
      'idTipoCategoria': check('value').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(BibliotecaValidator.validateExitsType),
      'tipo': check('value').trim().notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 3 }).withMessage('El tipo debe ser un numero entre 1 y 2'),
    }

    return [
      param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(BibliotecaValidator.validateIdFile),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      body('value').custom(async (id, { req }) => {
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