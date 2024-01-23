// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multer = require('multer');
// ■► Express Validator ◄■:
const { query } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const TypesCTR = require('../controllers/types.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const typesController = new TypesCTR();
//■► Router:  ◄■:
const router = Router();
//■► Multer:  ◄■:
const upload = multer();

//■► RUTEO: ===================================== ◄■:
router.post("/create", Middlewares.validateJWTMiddleware, async (req, res) => await typesController.saveTypes(req, res));
router.get("/list", [
    query('tipo')
        .trim()
        .notEmpty().withMessage('El campo "tipo" es requerido')
        .isInt({ min: 1, max: 3 }).withMessage('El campo "tipo" debe ser un número entero entre 1 y 3'),
    Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await typesController.getTypes(req, res));

module.exports = router;