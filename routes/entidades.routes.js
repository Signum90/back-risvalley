const { Router } = require('express');
const { body, param, check } = require('express-validator');
const entidadesCTR = require('../controllers/entidades.controller');
const EntidadesModel = require('../models/Entidades');
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const { validateExistId } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const typesController = new entidadesCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await typesController.getEntidades(req, res));

router.post("/create", multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await EntidadesModel.findOne({ where: { nombre } });
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
], Middlewares.validateJWTMiddleware, typesController.saveEntidad);

router.put("/:idEntidad/update", [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await EntidadesModel.findByPk(id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  Middlewares.scan_errors],
  Middlewares.validateJWTMiddleware, async (req, res) => await typesController.updateFieldEntidad(req, res))

router.put("/:idEntidad/update-logo", multerConfig.upload.single('logo'), [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await EntidadesModel.findByPk(id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await typesController.updateLogoEntidad(req, res));

router.delete("/:idEntidad/delete", [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId(EntidadesModel, id)
    if (!exists) return Promise.reject('Id entidad no válido');
  })
], Middlewares.validateJWTMiddleware, async (req, res) => await typesController.deleteEntidad(req, res))

module.exports = router;