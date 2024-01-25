const { Router } = require('express');
const multer = require('multer');
const { body, check } = require('express-validator');
const path = require('path');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const EventosCTR = require('../controllers/eventos.controller');
const CiudadesModel = require('../models/Ciudades');

const eventosController = new EventosCTR();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await eventosController.getEvents(req, res));

router.post("/create", multerConfig.upload.single('logo'), [
    check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
    check('descripcion').trim().notEmpty().isString().isLength({ max: 250 }),
    //check('logo').trim().notEmpty().isString().isLength({ max: 120 }),
    check('idCiudad').notEmpty().isInt().custom(async (id) => {
        const ciudad = await CiudadesModel.findByPk(id);
        if (!ciudad) return Promise.reject('Id ciudad no válido');
    }),
    check('fechaInicio').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio del evento debe ser mayor a hoy'),
    check('urlRegistro').trim().notEmpty().isString().isLength({ max: 80 }),
    check('precio').trim().optional({ nullable: true }).isInt().withMessage('El precio debe ser un número entero'),
    check('tipoResponsable').notEmpty().isInt({ min: 1, max: 3 }),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, eventosController.saveEvent);

module.exports = router;