const { Router } = require('express');
const { body, param, check } = require('express-validator');
const retosCTR = require('../controllers/retos.controller')
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const retosController = new retosCTR();
//■► Router:  ◄■:
const router = Router();

router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await retosController.getTechnologicalChallenges(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.fields([{ name: 'fichaTecnica', maxCount: 1 }, { name: 'recursoMultimedia', maxCount: 1 }]), [
    check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
    check('descripcion').trim().notEmpty().isString().isLength({ max: 150 }),
    check('fechaInicioConvocatoria').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a hoy'),
    check('fechaFinConvocatoria').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a hoy').custom(async (fechaFin, { req }) => {
        //if (req.body.fechaInicioConvocatoria > fechaFin) return Promise.reject('La fecha de cierre de la convocatoria debe ser mayor a la de inicio');
    }),
    check('fichaTecnica').custom(async (ficha, { req }) => {
        if (!req.files['fichaTecnica']) return Promise.reject('La ficha tecnica es obligatoria');
    }),
    check('recursoMultimedia').custom(async (recurso, { req }) => {
        if (!req.files['recursoMultimedia']) return Promise.reject('El recurso multimedia es obligatorio');
    }),
    Middlewares.scan_errors
], async (req, res) => await retosController.saveTechnologicalChallenge(req, res));

module.exports = router;