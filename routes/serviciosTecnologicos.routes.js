const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const ServiciosTecnologicosCTR = require('../controllers/serviciosTecnologicos.controller');
const ServiciosValidator = require('../validators/serviciosValidaciones');

const serviciosTecnologicosController = new ServiciosTecnologicosCTR();

router.get("/", async (req, res) => await serviciosTecnologicosController.getTechnologicalService(req, res));
router.get("/usuario", Middlewares.validateJWTMiddleware, async (req, res) => await serviciosTecnologicosController.getMyServices(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await serviciosTecnologicosController.getTechnologicalService(req, res));
router.get("/:idServicio/detalle",
  ServiciosValidator.validateIdService,
  async (req, res) => await serviciosTecnologicosController.validateExistsIdService(req, res));
router.post("/", Middlewares.validateJWTMiddleware,
  multerConfig.upload.single('imagen'),
  ServiciosValidator.createServicesValidator,
  async (req, res) => await serviciosTecnologicosController.postTechnologicalService(req, res));
router.post("/dashboard", Middlewares.validateAdminMiddleware,
  multerConfig.upload.single('imagen'),
  ServiciosValidator.createServiceDashboardValidator,
  async (req, res) => await serviciosTecnologicosController.postTechnologicalServiceFromDashboard(req, res));
router.put("/:idServicio/update", Middlewares.validateJWTMiddleware,
  ServiciosValidator.updateServiceValidator,
  async (req, res) => await serviciosTecnologicosController.updateTechnologicalService(req, res))
router.put("/:idServicio/update-image", Middlewares.validateJWTMiddleware,
  multerConfig.upload.single('imagen'),
  ServiciosValidator.validateUpdateImage,
  async (req, res) => await serviciosTecnologicosController.updateLogoService(req, res));
router.put("/:idServicio/aprobar", Middlewares.validateAdminMiddleware,
  ServiciosValidator.validateAprobeService,
  async (req, res) => await serviciosTecnologicosController.aprobeTechnologicalService(req, res))
router.delete("/:idServicio/delete", Middlewares.validateJWTMiddleware,
  ServiciosValidator.validateDeleteService,
  async (req, res) => await serviciosTecnologicosController.deleteService(req, res))

module.exports = router;