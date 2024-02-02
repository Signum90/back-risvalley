const { Router } = require('express');
const { body, param, check, validationResult } = require('express-validator');
const entidadesCTR = require('../controllers/entidades.controller');
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const entidadesController = new entidadesCTR();
//■► Router:  ◄■:
const router = Router();

const validations = [
  { name: 'nombre', validation: body('value').trim().notEmpty().isString().isLength({ max: 120 }), },
  { name: 'descripcion', validation: body('value').trim().notEmpty().isString().isLength({ max: 150 }), },
  { name: 'sigla', validation: body('value').trim().notEmpty().isString().isLength({ max: 10 }), },
  { name: 'tipo', validation: body('value').notEmpty().isInt({ min: 1, max: 3 }), },
  { name: 'idTipoNaturalezaJuridica', validation: body('value').notEmpty().isInt(), },
  { name: 'idTipoServicio', validation: body('value').notEmpty().isInt(), },
  { name: 'idTipoClienteServicio', validation: body('value').notEmpty().isInt(), },
  { name: 'contactoNombre', validation: body('value').trim().notEmpty().isString().isLength({ max: 70 }), },
  { name: 'contactoCargo', validation: body('value').trim().notEmpty().isString().isLength({ max: 70 }), },
  { name: 'contactoCorreo', validation: body('value').trim().notEmpty().isString().isLength({ max: 80 }), },
  { name: 'contactoTelefono', validation: body('value').trim().notEmpty().isInt().isLength({ max: 11 }), },
  { name: 'direccion', validation: body('value').trim().notEmpty().isString().isLength({ max: 80 }), },
  { name: 'nombreServicio', validation: body('value').trim().notEmpty().isString().isLength({ max: 30 }), },
  { name: 'descripcionServicio', validation: body('value').trim().notEmpty().isString().isLength({ max: 50 }), },
  { name: 'urlDominio', validation: body('value').trim().isString().isLength({ max: 80 }), },
  { name: 'urlFacebook', validation: body('value').trim().isString().isLength({ max: 80 }), },
  { name: 'urlTwitter', validation: body('value').trim().isString().isLength({ max: 80 }), },
  { name: 'urlLinkedin', validation: body('value').trim().isString().isLength({ max: 80 }), }
]

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getEntidades(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await validateFieldUnique('entidad', 'nombre', nombre)
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('sigla').trim().notEmpty().isString().isLength({ max: 10 }),
  check('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  check('idTipoNaturalezaJuridica').notEmpty().isInt(),
  check('idTipoServicio').notEmpty().isInt(),
  check('idTipoClienteServicio').notEmpty().isInt(),
  check('contactoNombre').trim().notEmpty().isString().isLength({ max: 70 }),
  check('contactoCargo').trim().notEmpty().isString().isLength({ max: 70 }),
  check('contactoCorreo').trim().notEmpty().isString().isLength({ max: 80 }),
  check('contactoTelefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  check('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('nombreServicio').trim().notEmpty().isString().isLength({ max: 30 }),
  check('descripcionServicio').trim().notEmpty().isString().isLength({ max: 50 }),
  check('urlDominio').trim().isString().isLength({ max: 80 }),
  check('urlFacebook').trim().isString().isLength({ max: 80 }),
  check('urlTwitter').trim().isString().isLength({ max: 80 }),
  check('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], entidadesController.saveEntidad);

router.put("/:idEntidad/update", Middlewares.validateJWTMiddleware, [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  //validacion dinamica dependiendo del campo que se va a editar
  body('value').notEmpty().custom(async (id, { req }) => {
    const validate = validations.find((e) => e.name == req.body.campo)?.validation
    if (!validate) return Promise.reject('Campo no válido');
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors], async (req, res) => await entidadesController.updateFieldEntidad(req, res))

router.put("/:idEntidad/update-logo", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.updateLogoEntidad(req, res));

router.delete("/:idEntidad/delete", Middlewares.validateJWTMiddleware, [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('entidad', id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.deleteEntidad(req, res))

module.exports = router;