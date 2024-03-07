const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

class ServiciosValidator {
  static async validateExitsType(tipo) {
    const exists = await validateExistId('tipo', tipo);
    if (!exists) return Promise.reject('Tipo no válido');
  }
  static async validateIdUser(id) {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }
  static async validateIdService(id) {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }

  static get createServicesValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripcion no debe tener más de 150 caracteres'),
      check('idTipoServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateExitsType),
      check('idTipoClienteServicio').notEmpty().isInt().custom(ServiciosValidator.validateExitsType),
      check('imagen').custom(async (imagen, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!req.file) return Promise.reject('El campo imagen es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
      }),
      Middlewares.scan_errors
    ]
  }
  static get createServiceDashboardValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('idUserContacto').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateIdUser),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripcion no debe tener más de 150 caracteres'),
      check('idTipoServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateExitsType),
      check('idTipoClienteServicio').notEmpty().isInt().custom(ServiciosValidator.validateExitsType),
      check('imagen').custom(async (imagen, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!req.file) return Promise.reject('El campo imagen es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
      }),
      Middlewares.scan_errors
    ]
  }
  static get updateServiceValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateIdService),
      body('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      body('descripcion').trim().notEmpty()
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripción debe tener máximo 150 caracteres'),
      body('idTipoServicio').notEmpty()
        .isInt().custom(ServiciosValidator.validateExitsType),
      body('idTipoClienteServicio').notEmpty()
        .isInt().custom(ServiciosValidator.validateExitsType),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get validateExistsIdService() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateIdService),
      Middlewares.scan_errors
    ]
  }
  static get validateUpdateImage() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateIdService),
      check('imagen').custom(async (imagen, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (!req.file) return Promise.reject('El campo imagen es obligatorio');
        if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
      }),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get validateAprobeService() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idServicio').notEmpty().isInt().custom(ServiciosValidator.validateIdService),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get validateDeleteService() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idServicio').notEmpty().isInt().custom(ServiciosValidator.validateIdService),
      query('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
  static get updateFieldService() {
    const customMessages = CustomMessages.getValidationMessages();

    const validations = {
      'nombre': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 120 }).withMessage('El nombre no puede tener más de 120 caracteres'),
      'descripcion': body('value').trim().isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage('La descripción no puede tener más de 150 caracteres'),
      'idTipoServicio': body('value').notEmpty().isInt().custom(ServiciosValidator.validateExitsType),
      'idTipoClienteServicio': body('value').trim().isInt().withMessage(customMessages.int).custom(ServiciosValidator.validateExitsType)
    }

    return [
      param('idServicio').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(ServiciosValidator.validateIdService),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      body('value').notEmpty().withMessage(customMessages.required).custom(async (value, { req }) => {
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

module.exports = ServiciosValidator;