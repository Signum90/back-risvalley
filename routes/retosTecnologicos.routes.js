const { Router } = require('express');
const retosCTR = require('../controllers/retos.controller')
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const RetosValidator = require('../validators/retosTecnologicosValidaciones');


//■► Instancia controlador:  ◄■:
const retosController = new retosCTR();
//■► Router:  ◄■:
const router = Router();

router.get("/list", async (req, res) => await retosController.getTechnologicalChallenges(req, res));
router.get("/usuario", Middlewares.validateJWTMiddleware, async (req, res) => retosController.getUserTechnologicalChallenges(req, res))
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await retosController.getAllTechnologicalChallenges(req, res));
router.post("/create", Middlewares.validateJWTMiddleware,
  multerConfig.upload.fields([{ name: 'fichaTecnica', maxCount: 1 }, { name: 'recursoMultimedia', maxCount: 1 }]),
  RetosValidator.createChallengeValidator,
  async (req, res) => await retosController.saveTechnologicalChallenge(req, res));
router.post("/create/dashboard", Middlewares.validateAdminMiddleware,
  multerConfig.upload.fields([{ name: 'fichaTecnica', maxCount: 1 }, { name: 'recursoMultimedia', maxCount: 1 }]),
  RetosValidator.createChallengeDashboardValidator,
  async (req, res) => await retosController.saveTechnologicalChallengeFromDashboard(req, res));
router.put("/:idReto/update-files", Middlewares.validateJWTMiddleware,
  multerConfig.upload.single('file'),
  RetosValidator.updateFilesValidator,
  async (req, res) => await retosController.updateFilesChallenge(req, res));
router.put("/:idReto/update", Middlewares.validateJWTMiddleware,
  RetosValidator.updateFieldsValidator,
  async (req, res) => await retosController.updateFieldChallenge(req, res));
router.delete("/:idReto/delete", Middlewares.validateJWTMiddleware,
  RetosValidator.deleteChallengeValidator,
  async (req, res) => await retosController.deleteReto(req, res))
router.put("/:idReto/aprobar", Middlewares.validateAdminMiddleware,
  RetosValidator.aprobeChallengeValidator,
  async (req, res) => await retosController.aprobeTechnologicalChallenge(req, res))


module.exports = router;