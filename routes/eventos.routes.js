const { Router } = require('express');
const { param, check, body } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const EventosCTR = require('../controllers/eventos.controller');
const CiudadesModel = require('../models/Ciudades');
const EventosModel = require('../models/Eventos');

const eventosController = new EventosCTR();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.getEvents(req, res));

router.post("/create", multerConfig.upload.single('logo'), [
    check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
    check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
    check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
    check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
    check('tipoResponsable').notEmpty().isInt({ min: 1, max: 3 }),
    check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
    check('idCiudad').notEmpty().isInt().custom(async (id) => {
        const ciudad = await CiudadesModel.findByPk(id);
        if (!ciudad) return Promise.reject('Id ciudad no válido');
    }),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, eventosController.saveEvent);

router.put("/:idEvento/update-logo", multerConfig.upload.single('logo'), [
    param('idEvento').notEmpty().isInt().custom(async (id) => {
        const exists = await EventosModel.findByPk(id)
        if (!exists) return Promise.reject('Id evento no válido');
    }),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.updateLogoEvent(req, res));

router.put("/:idEvento/update", [
    param('idEvento').notEmpty().isInt().custom(async (id) => {
        const exists = await EventosModel.findByPk(id)
        if (!exists) return Promise.reject('Id evento no válido');
    }),
    check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
    check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
    check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
    check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
    check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.updateEvent(req, res));

router.delete("/:idEvento/delete", [
    param('idEvento').notEmpty().isInt().custom(async (id) => {
        const exists = await EventosModel.findByPk(id)
        if (!exists) return Promise.reject('Id evento no válido');
    }),
], Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.deleteEvent(req, res))
module.exports = router;