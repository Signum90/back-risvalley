const { Router } = require('express');
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const entidadesCTR = require('../controllers/entidades.controller');
const EntidadesValidator = require('../validators/entidadesValidaciones');

//■► Instancia controlador:  ◄■:
const entidadesController = new entidadesCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getEntidades(req, res));
router.get("/usuario", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getUserEntidad(req, res));
router.get("/select", Middlewares.validateJWTMiddleware, async (req, res) => await entidadesController.getSelectEntidades(req, res));
router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), EntidadesValidator.entidadesValidator, entidadesController.saveEntidad);
router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), EntidadesValidator.entidadesValidatorNotUser, entidadesController.saveEntidad);
router.put("/:idEntidad/update", Middlewares.validateJWTMiddleware, EntidadesValidator.entidadesValidatorDinamic, async (req, res) => await entidadesController.updateFieldEntidad(req, res))
router.put("/:idEntidad/update-logo", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), EntidadesValidator.logoUpdateValidator, async (req, res) => await entidadesController.updateLogoEntidad(req, res));
router.delete("/:idEntidad/delete", Middlewares.validateJWTMiddleware, EntidadesValidator.deleteEntidadValidator, async (req, res) => await entidadesController.deleteEntidad(req, res))

module.exports = router;