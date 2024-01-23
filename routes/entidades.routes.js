// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multer = require('multer');
// ■► Express Validator ◄■:
const { body } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const entidadesCTR = require('../controllers/entidades.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const typesController = new entidadesCTR();
//■► Router:  ◄■:
const router = Router();
//■► Multer:  ◄■:
const upload = multer();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await typesController.getEntidades(req, res));

router.post("/create", [
  body('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
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

module.exports = router;