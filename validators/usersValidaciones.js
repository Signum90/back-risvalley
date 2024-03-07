const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

class UsersValidator {
  static async validateUniqueEmail(email) {
    const exists = await validateFieldUnique('user', 'email', email)
    if (exists) return Promise.reject('El correo electronico ya se encuentra registrado');
  }
  static async validateIdUserExists(id) {
    const exists = await validateExistId('user', id);
    if (!exists) return Promise.reject('Id user no válido');
  }
  static async validateXTipoId(id) {
    const exists = await validateExistId('tipo', id);
    if (!exists) return Promise.reject('Id tipo no válido');
  }

  static get userValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      check('email').trim().notEmpty().withMessage(customMessages.required)
        .isEmail().withMessage(customMessages.email)
        .custom(UsersValidator.validateUniqueEmail),
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 40 }).withMessage(customMessages.length),
      check('telefono').trim()
        .optional({ nullable: true }).isInt().withMessage(customMessages.int)
        .isLength({ max: 11 }).withMessage(customMessages.length),
      check('password').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

  static get userUpdateValidate() {
    const customMessages = CustomMessages.getValidationMessages();
    const validations = {
      'email': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isEmail().withMessage(customMessages.email).custom(UsersValidator.validateUniqueEmail),
      'nombre': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 40 }).withMessage('el nombre debe tener como máximo 40 caracteres'),
      'telefono': body('value').trim().optional({ nullable: true })
        .isInt().withMessage(customMessages.int)
        .isLength({ max: 11 }).withMessage('El numero de telefono no debe tener más de 11 caracteres'),
      'cargo': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 70 }).withMessage('El cargo debe tener como máximo 70 caracteres'),
      'password': body('value').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 25 }).withMessage('El cargo debe tener como máximo 25 caracteres'),
    }

    return [
      param('idUser').notEmpty().isInt().custom(UsersValidator.validateIdUserExists),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      body('value').notEmpty().custom(async (value, { req }) => {
        const validate = validations[req.body.campo]
        if (!validate) return Promise.reject('Campo no válido');
        await validate.run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return Promise.reject('error');
      }),
      Middlewares.scan_errors
    ]
  }

  static get userDashboardValidate() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      body('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 40 }).withMessage('El campo nombre debe tener como máximo 40 caracteres'),
      check('cargo').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 70 }).withMessage('El campo cargo debe tener como máximo 70 caracteres'),
      check('telefono').trim().optional({ nullable: true })
        .isInt().withMessage(customMessages.int)
        .isLength({ max: 11 }).withMessage(customMessages.length),
      check('tipo').notEmpty().withMessage(customMessages.required)
        .isInt({ min: 1, max: 4 }).withMessage('El tipo debe ser un numero entre 1 y 4'),
      check('email').trim().notEmpty().withMessage(customMessages.required)
        .isEmail().withMessage(customMessages.email)
        .custom(UsersValidator.validateUniqueEmail),
      check('nombreEntidad').trim().isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El nombre de la entidad debe tener como máximo 120 caracteres').custom(async (nombre, { req }) => {
          if (req.body.tipo != 1) {
            if (!nombre) return Promise.reject('El nombre de la entidad es obligatorio');
            const exists = await validateFieldUnique('entidad', 'nombre', nombre)
            if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
          }
        }),
      check('descripcion').trim().isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage('La descripción de la entidad debe tener como máximo 80 caracteres')
        .custom(async (descripcion, { req }) => {
          if (req.body.tipo != 1 && !descripcion) return Promise.reject('La descripcion de la entidad es obligatoria');
        }),
      check('sigla').trim().isString().withMessage(customMessages.string)
        .isLength({ max: 10 }).withMessage('El campo sigla debe tener como máximo 10 caracteres').custom(async (sigla, { req }) => {
          if (req.body.tipo != 1 && !sigla) return Promise.reject('Las siglas de la entidad son obligatorias');
        }),
      check('tipoEntidad').custom(async (tipoEntidad, { req }) => {
        if (req.body.tipo != 1) {
          if (!tipoEntidad) return Promise.reject('El tipo de la entidad es obligatorio');
          if (![1, 2, 3].includes(Number(tipoEntidad))) return Promise.reject('El tipo de la entidad debe ser un numero entre 1 y 3')
        }
      }),
      check('idTipoNaturalezaJuridica').custom(async (tipoNaturaleza, { req }) => {
        if (req.body.tipo != 1) {
          if (!tipoNaturaleza) return Promise.reject('El tipo de naturaleza de la entidad es obligatorio');
          await UsersValidator.validateXTipoId(tipoNaturaleza)
        }
      }),
      check('direccion').trim().isString().withMessage(customMessages.string)
        .isLength({ max: 80 }).withMessage(customMessages.length).custom(async (direccion, { req }) => {
          if (req.body.tipo != 1 && !direccion) return Promise.reject('La direccion de la entidad es obligatoria');
        }),
      check('telefonoEntidad').trim().isLength({ max: 11 }).withMessage(customMessages.length).custom(async (telefono, { req }) => {
        if (req.body.tipo != 1 && !telefono) return Promise.reject('El telefono de la entidad es obligatorio');
      }),
      check('emailEntidad').trim().custom(async (email, { req }) => {
        if (req.body.tipo != 1 && !email) return Promise.reject('El email de la entidad es obligatorio');
      }),
      check('urlDominio').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
      check('urlFacebook').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
      check('urlTwitter').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
      check('urlLinkedin').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
      Middlewares.scan_errors
    ]
  }

  static get updateLogoValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idUser').notEmpty().isInt().custom(UsersValidator.validateIdUserExists),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      check('logo').custom(async (imagen, { req }) => {
        const imageFormat = ['image/jpeg', 'image/png'];
        if (req?.file) {
          if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
        }
      }),
      Middlewares.scan_errors
    ]
  }

  static get deleteUserValidator() {
    const customMessages = CustomMessages.getValidationMessages();
    return [
      param('idUser').notEmpty().isInt().custom(UsersValidator.validateIdUserExists),
      query('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
}

module.exports = UsersValidator;