const { body, validationResult, check, param, query } = require('express-validator');
const Middlewares = require('../middlewares/middlewares');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

class RetosValidator {
  static async validateIdUser(id) {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }

  static async validateIdReto(id) {
    const exists = await validateExistId('reto', id)
    if (!exists) return Promise.reject('Id reto no válido');
  }

  static get createChallengeValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre debe tener máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripción debe tener máximo 150 caracteres'),
      check('fechaInicioConvocatoria').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a la actual'),
      check('fechaFinConvocatoria').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a la actual')
        .custom(async (fechaFin, { req }) => {
          if (new Date(req.body.fechaInicioConvocatoria) > new Date(fechaFin)) return Promise.reject('La fecha de cierre de la convocatoria debe ser mayor a la de inicio');
        }),
      check('fichaTecnica').custom(async (ficha, { req }) => {
        const imageFormat = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!req.files['fichaTecnica']) return Promise.reject('La ficha tecnica es obligatoria');
        if (!imageFormat.includes(req.files['fichaTecnica'][0].mimetype)) return Promise.reject('La ficha tecnica debe ser un archivo word o un archivo pdf');
      }),
      check('recursoMultimedia').custom(async (recurso, { req }) => {
        const imageFormat = [
          'image/jpeg',
          'image/png',
          'video/mp4',
          'video/mpeg',
        ];
        if (!req.files['recursoMultimedia']) return Promise.reject('El recurso multimedia es obligatorio');
        if (!imageFormat.includes(req.files['recursoMultimedia'][0].mimetype)) return Promise.reject('El archivo multimedia debe ser una imagen o un video');
      }),
      Middlewares.scan_errors
    ]
  }

  static get createChallengeDashboardValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      check('nombre').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 120 }).withMessage('El campo nombre debe tener máximo 120 caracteres'),
      check('descripcion').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .isLength({ max: 150 }).withMessage('El campo descripción debe tener máximo 150 caracteres'),
      check('fechaInicioConvocatoria').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a la actual'),
      check('fechaFinConvocatoria').notEmpty().withMessage(customMessages.required)
        .isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a la actual')
        .custom(async (fechaFin, { req }) => {
          if (new Date(req.body.fechaInicioConvocatoria) > new Date(fechaFin)) return Promise.reject('La fecha de cierre de la convocatoria debe ser mayor a la de inicio');
        }),
      check('fichaTecnica').custom(async (ficha, { req }) => {
        const imageFormat = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!req.files['fichaTecnica']) return Promise.reject('La ficha tecnica es obligatoria');
        if (!imageFormat.includes(req.files['fichaTecnica'][0].mimetype)) return Promise.reject('La ficha tecnica debe ser un archivo word o un archivo pdf');
      }),
      check('recursoMultimedia').custom(async (recurso, { req }) => {
        const imageFormat = [
          'image/jpeg',
          'image/png',
          'video/mp4',
          'video/mpeg',
        ];
        if (!req.files['recursoMultimedia']) return Promise.reject('El recurso multimedia es obligatorio');
        if (!imageFormat.includes(req.files['recursoMultimedia'][0].mimetype)) return Promise.reject('El archivo multimedia debe ser una imagen o un video');
      }),
      check('idUserEntidad').notEmpty().isInt().custom(RetosValidator.validateIdUser),
      Middlewares.scan_errors
    ]
  }

  static get updateFilesValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idReto').notEmpty().isInt().custom(RetosValidator.validateIdReto),
      check('campo').trim().notEmpty().withMessage(customMessages.required)
        .isString().withMessage(customMessages.string)
        .custom(async (campo, { req }) => {
          const campos = [
            'fichaTecnica',
            'recursoMultimedia'
          ];
          if (!campos.includes(campo)) return Promise.reject('Campo no válido');
        }),
      check('file').custom(async (ficha, { req }) => {
        if (!req.file) return Promise.reject('El campo file es obligatorio');
        let formats
        if (req.body.campo == 'fichaTecnica') {
          formats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        } else {
          formats = ['image/jpeg', 'image/png', 'video/mp4', 'video/mpeg']
        }
        if (!formats.includes(req.file.mimetype)) return Promise.reject('Archivo no válido');
      }),
      check('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

  static get updateFieldsValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idReto').notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(RetosValidator.validateIdReto),
      body('value').notEmpty().withMessage(customMessages.required).custom(async (value, { req }) => {
        let validate
        switch (req.body.campo) {
          case 'nombre':
            validate = check('value').trim().isString().withMessage(customMessages.string).isLength({ max: 120 }).withMessage('El nombre no puede tener más de 120 caracteres')
            break;
          case 'descripcion':
            validate = check('value').trim().isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage('La descripción no puede tener más de 150 caracteres')
            break;
          case 'fechaInicioConvocatoria':
            validate = check('value').isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a hoy')
            break;
          case 'fechaFinConvocatoria':
            validate = check('value').isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a hoy')
            break;
          case 'estado':
            validate = check('value').notEmpty().isInt({ min: 3, max: 3 }).withMessage('El estado solo se puede cambiar a finalizado')
            break;
          default:
            return Promise.reject('Campo no válido');
        }
        //ejecuta la validacion encontrada
        await validate.run(req);
        const errors = validationResult(req);
        //comprueba si hay errores y los retorna
        if (!errors.isEmpty()) return Promise.reject('error');
      }),
      body('keydata').trim().notEmpty().withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

  static get deleteChallengeValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idReto').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(RetosValidator.validateIdReto),
      query('keydata').trim().notEmpty().withMessage(customMessages.required)
        .withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }

  static get aprobeChallengeValidator() {
    const customMessages = CustomMessages.getValidationMessages();

    return [
      param('idReto').notEmpty().withMessage(customMessages.required)
        .isInt().withMessage(customMessages.int)
        .custom(RetosValidator.validateIdReto),
      body('keydata').trim().notEmpty().withMessage(customMessages.required)
        .withMessage(customMessages.required),
      Middlewares.scan_errors
    ]
  }
}

module.exports = RetosValidator;