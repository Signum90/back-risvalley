const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');

class CursosValidator {

  static async validateIdCourse(id) {
    const exists = await validateExistId('curso', id)
    if (!exists) return Promise.reject('Id curso no válido');
  }
  static async validateExitsType(tipo) {
    const exists = await validateExistId('tipo', tipo);
    if (!exists) return Promise.reject('Tipo no válido');
  }


  static get postCourseValidation() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 150 caracteres'),
      check('file').custom(async (file, { req }) => {
        const imagen = req.files['imagen'];
        const fichaTecnica = req.files['fichaTecnica'];
        const pdfFormat = ['application/pdf'];
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!fichaTecnica) return Promise.reject('La ficha tecnica es obligatoria');
        if (!imagen) return Promise.reject('La imagen es obligatoria');
        if (!pdfFormat.includes(fichaTecnica[0]?.mimetype)) return Promise.reject('La ficha tecnica debe ser un pdf');
        if (!imageFormat.includes(imagen[0]?.mimetype)) return Promise.reject('Ingrese una imagen válida');
      }),
      check('idCategoria').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int).custom(CursosValidator.validateExitsType),
      Middlewares.scan_errors
    ]
  }
  static get aprobeCourseValidation() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(CursosValidator.validateIdCourse),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get detailCourseValidation() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(CursosValidator.validateIdCourse),
      Middlewares.scan_errors
    ]
  }
  static get validateStudentCourseValidation() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      query('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(CursosValidator.validateIdCourse),
      Middlewares.scan_errors
    ]
  }
  static get updateCorseFieldValidation() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'nombre': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
      'descripcion': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 150 caracteres'),
      'estado': body('value').notEmpty().isInt({ min: 0, max: 1 }).withMessage('El estado debe ser un valor entre 0 y 1'),
      'idTipoCategoria': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int).custom(CursosValidator.validateExitsType),
    }

    return [
      param('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(CursosValidator.validateIdCourse),
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

  static get updateFilesCurso() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'imagen': check('file').custom(async (file, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!req.file) return Promise.reject('La imagen es obligatoria');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese una imagen válida');
      }),
      'fichaTecnica': check('file').custom(async (file, { req }) => {
        const pdfFormat = ['application/pdf'];
        if (!req.file) return Promise.reject('La ficha tecnica es obligatoria');
        if (!pdfFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese una imagen válida');
      })
    }
    return [
      param('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(CursosValidator.validateIdCourse),
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
}

module.exports = CursosValidator;