const { Router } = require('express');
const { body, param } = require('express-validator');
const entidadesCTR = require('../controllers/entidades.controller');
const EntidadesModel = require('../models/Entidades');
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const typesController = new entidadesCTR();
//■► Router:  ◄■:
const router = Router();

const validations = [
  { name: 'descripcion', validation: body('descripcion').trim().notEmpty().isString().isLength({ max: 80 }), },
  { name: 'logo', validation: body('logo').trim().optional({ nullable: true }).isString().isLength({ max: 120 }), },
  { name: 'sigla', validation: body('sigla').trim().notEmpty().isString().isLength({ max: 10 }), },
  { name: 'tipo', validation: body('tipo').notEmpty().isInt({ min: 1, max: 3 }), },
  { name: 'idTipoNaturalezaJuridica', validation: body('idTipoNaturalezaJuridica').notEmpty().isInt(), },
  { name: 'idTipoServicio', validation: body('idTipoServicio').notEmpty().isInt(), },
  { name: 'idTipoClienteServicio', validation: body('idTipoClienteServicio').notEmpty().isInt(), },
  { name: 'contactoNombre', validation: body('contactoNombre').trim().notEmpty().isString().isLength({ max: 70 }), },
  { name: 'contactoCargo', validation: body('contactoCargo').trim().notEmpty().isString().isLength({ max: 70 }), },
  { name: 'contactoCorreo', validation: body('contactoCorreo').trim().notEmpty().isString().isLength({ max: 80 }), },
  { name: 'contactoTelefono', validation: body('contactoTelefono').trim().notEmpty().isInt().isLength({ max: 11 }), },
  { name: 'direccion', validation: body('direccion').trim().notEmpty().isString().isLength({ max: 80 }), },
  { name: 'nombreServicio', validation: body('nombreServicio').trim().notEmpty().isString().isLength({ max: 30 }), },
  { name: 'descripcionServicio', validation: body('descripcionServicio').trim().notEmpty().isString().isLength({ max: 50 }), },
  { name: 'urlDominio', validation: body('urlDominio').trim().isString().isLength({ max: 80 }), },
  { name: 'urlFacebook', validation: body('urlFacebook').trim().isString().isLength({ max: 80 }), },
  { name: 'urlTwitter', validation: body('urlTwitter').trim().isString().isLength({ max: 80 }), },
  { name: 'urlLinkedin', validation: body('urlLinkedin').trim().isString().isLength({ max: 80 }), }
]

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await typesController.getEntidades(req, res));

router.post("/create", [
  body('nombre').trim().notEmpty().isString().isLength({ max: 120 }).custom(async (nombre) => {
    const exists = await EntidadesModel.findOne({ where: { nombre } });
    if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
  }),
  body('descripcion').trim().notEmpty().isString().isLength({ max: 80 }),
  body('logo').trim().optional({ nullable: true }).isString().isLength({ max: 120 }),
  body('sigla').trim().notEmpty().isString().isLength({ max: 10 }),
  body('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  body('idTipoNaturalezaJuridica').notEmpty().isInt(),
  body('idTipoServicio').notEmpty().isInt(),
  body('idTipoClienteServicio').notEmpty().isInt(),
  body('contactoNombre').trim().notEmpty().isString().isLength({ max: 70 }),
  body('contactoCargo').trim().notEmpty().isString().isLength({ max: 70 }),
  body('contactoCorreo').trim().notEmpty().isString().isLength({ max: 80 }),
  body('contactoTelefono').trim().notEmpty().isInt().isLength({ max: 11 }),
  body('direccion').trim().notEmpty().isString().isLength({ max: 80 }),
  body('nombreServicio').trim().notEmpty().isString().isLength({ max: 30 }),
  body('descripcionServicio').trim().notEmpty().isString().isLength({ max: 50 }),
  body('urlDominio').trim().isString().isLength({ max: 80 }),
  body('urlFacebook').trim().isString().isLength({ max: 80 }),
  body('urlTwitter').trim().isString().isLength({ max: 80 }),
  body('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, typesController.saveEntidad);

router.put("/:idEntidad/update", [
  param('idEntidad').notEmpty().isInt().custom(async (id) => {
    const exists = await EntidadesModel.findByPk(id)
    if (!exists) return Promise.reject('Id entidad no válido');
  }),
  //validations.filter((e) => e.nombre == 'nombre')?.validation,
  Middlewares.scan_errors], Middlewares.validateJWTMiddleware, async (req, res) => await typesController.updateFieldEntidad(req, res))

module.exports = router;