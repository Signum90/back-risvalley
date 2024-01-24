const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const EventosCTR = require('../controllers/eventos.controller');
const { body, check } = require('express-validator');
const CiudadesModel = require('../models/Ciudades');

const eventosController = new EventosCTR();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.getEvents(req, res));

router.post("/create", [
    body('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
    body('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
    body('logo').trim().notEmpty().isString().isLength({ max: 120 }),
    check('idCiudad').notEmpty().isInt().custom(async (id) => {
        const ciudad = await CiudadesModel.findByPk(id);
        if (!ciudad) return Promise.reject('Id ciudad no válido');
    }),
    body('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
    body('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
    body('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
    body('tipoResponsable').notEmpty().isInt({ min: 1, max: 3 }),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, eventosController.saveEvent);

module.exports = router;