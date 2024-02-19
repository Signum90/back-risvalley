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

const validations = {
  'nombre': body('value').trim().notEmpty().isString().isLength({ max: 120 }),
  'descripcion': body('value').trim().notEmpty().isString().isLength({ max: 150 }),
  'sigla': body('value').trim().notEmpty().isString().isLength({ max: 10 }),
  'tipo': body('value').notEmpty().isInt({ min: 1, max: 3 }),
  'idTipoNaturalezaJuridica': body('value').notEmpty().isInt(),
  'contactoNombre': body('value').trim().notEmpty().isString().isLength({ max: 70 }),
  'contactoCargo': body('value').trim().notEmpty().isString().isLength({ max: 70 }),
  'contactoCorreo': body('value').trim().notEmpty().isString().isLength({ max: 80 }),
  'contactoTelefono': body('value').trim().notEmpty().isInt().isLength({ max: 11 }),
  'direccion': body('value').trim().notEmpty().isString().isLength({ max: 80 }),
  'urlDominio': body('value').trim().isString().isLength({ max: 80 }),
  'urlFacebook': body('value').trim().isString().isLength({ max: 80 }),
  'urlTwitter': body('value').trim().isString().isLength({ max: 80 }),
  'urlLinkedin': body('value').trim().isString().isLength({ max: 80 }),
}

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
  check('email').trim().notEmpty().isString().isLength({ max: 80 }),
  check('telefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  check('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('urlDominio').trim().isString().isLength({ max: 80 }),
  check('urlFacebook').trim().isString().isLength({ max: 80 }),
  check('urlTwitter').trim().isString().isLength({ max: 80 }),
  check('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], entidadesController.saveEntidad);

router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await validateFieldUnique('entidad', 'nombre', nombre)
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }),
  check('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 80 }),
  check('sigla').trim().notEmpty().isString().isLength({ max: 10 }),
  check('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  check('idTipoNaturalezaJuridica').notEmpty().isInt(),
  check('email').trim().notEmpty().isString().isLength({ max: 80 }),
  check('telefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  check('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
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
    const validate = validations[req.body.campo]
    if (!validate) return Promise.reject('Campo no válido');
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors
], async (req, res) => await entidadesController.updateFieldEntidad(req, res))

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