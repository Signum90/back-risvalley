const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

class EventosValidator {
  static async validateExitsCity(id) {
    const ciudad = await validateExistId('ciudad', id)
    if (!ciudad) return Promise.reject('Id ciudad no válido');
  }
  static async validateIdUser(id) {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }
  static async validateIdEvent(id) {
    const exists = await validateExistId('evento', id)
    if (!exists) return Promise.reject('Id evento no válido');
  }

  static get createEventValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      check('fechaInicio').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
      check('urlRegistro').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.required)
        .isLength({ max: 80 }).withMessage('El campo URL no debe tener más de 180 caracteres'),
      check('precio').trim().optional({ nullable: true })
        .isInt().withMessage(customMessages.int),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 250 }).withMessage('El campo descripción no debe tener más de 250 caracteres'),
      check('idCiudad').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(EventosValidator.validateExitsCity),
      check('imagen').custom(async (imagen, { req }) => {
        if (req?.file) {
          const imageFormat = ['image/jpeg', 'image/png'];
          if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
        }
      }),
      Middlewares.scan_errors
    ]
  }

  static get createEventDashboardValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      check('fechaInicio').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
      check('urlRegistro').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.required)
        .isLength({ max: 80 }).withMessage('El campo URL no debe tener más de 180 caracteres'),
      check('precio').trim().optional({ nullable: true })
        .isInt().withMessage(customMessages.int),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 250 }).withMessage('El campo descripción no debe tener más de 250 caracteres'),
      check('idCiudad').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(EventosValidator.validateExitsCity),
      check('idUserResponsable').notEmpty().isInt().custom(EventosValidator.validateIdUser),
      check('imagen').custom(async (imagen, { req }) => {
        if (req?.file) {
          const imageFormat = ['image/jpeg', 'image/png'];
          if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
        }
      }),
      Middlewares.scan_errors
    ]
  }

  static get editEventLogoValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idEvento').notEmpty().isInt().custom(EventosValidator.validateIdEvent),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      check('imagen').custom(async (imagen, { req }) => {
        if (req?.file) {
          const imageFormat = ['image/jpeg', 'image/png'];
          if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
        }
      }),
      Middlewares.scan_errors
    ]
  }

  static get editFieldEventValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'nombre': body('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 120 }),
      'fechaInicio': body('value').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
      'urlRegistro': body('value').trim().notEmpty().isString().isLength({ max: 80 }),
      'precio': body('value').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
      'descripcion': body('value').trim().notEmpty().isString().isLength({ max: 250 }),
    }

    return [
      param('idEvento').notEmpty().isInt().custom(EventosValidator.validateIdEvent),
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
  static get updateEventValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idEvento').notEmpty()
        .isInt()
        .custom(EventosValidator.validateIdEvent),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre no debe tener más de 120 caracteres'),
      check('fechaInicio').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
      check('urlRegistro').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.required)
        .isLength({ max: 80 }).withMessage('El campo URL no debe tener más de 180 caracteres'),
      check('precio').trim().optional({ nullable: true })
        .isInt().withMessage(customMessages.int),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().isLength({ max: 250 }).withMessage('El campo descripción no debe tener más de 250 caracteres'),
      check('idCiudad').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(EventosValidator.validateExitsCity),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

  static get deleteEventValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idEvento').notEmpty().withMessage(customMessages.required).isInt().custom(EventosValidator.validateIdEvent),
      query('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
}

module.exports = EventosValidator;