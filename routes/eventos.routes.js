const { Router } = require('express');
const { param, check } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const EventosCTR = require('../controllers/eventos.controller');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

const eventosController = new EventosCTR();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.getEvents(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
  check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
  check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
  check('idCiudad').notEmpty().isInt().custom(async (id) => {
    const ciudad = await validateExistId('ciudad', id)
    if (!ciudad) return Promise.reject('Id ciudad no válido');
  }),
  Middlewares.scan_errors
], eventosController.saveEvent);

router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
  check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
  check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
  check('idCiudad').notEmpty().isInt().custom(async (id) => {
    const ciudad = await validateExistId('ciudad', id)
    if (!ciudad) return Promise.reject('Id ciudad no válido');
  }),
  check('idUserResponsable').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  Middlewares.scan_errors
], eventosController.saveEvent);

router.put("/:idEvento/update-logo", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), [
  param('idEvento').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('evento', id)
    if (!exists) return Promise.reject('Id evento no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await eventosController.updateLogoEvent(req, res));

router.put("/:idEvento/update", Middlewares.validateJWTMiddleware, [
  param('idEvento').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('evento', id)
    if (!exists) return Promise.reject('Id evento no válido');
  }),
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
  check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
  check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
  Middlewares.scan_errors
], async (req, res) => await eventosController.updateEvent(req, res));

router.delete("/:idEvento/delete", Middlewares.validateJWTMiddleware, [
  param('idEvento').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('evento', id)
    if (!exists) return Promise.reject('Id evento no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await eventosController.deleteEvent(req, res))
module.exports = router;