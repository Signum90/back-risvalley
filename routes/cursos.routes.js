const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const CursosCTR = require('../controllers/cursos.controller');
const MulterConfig = require('../config/MulterConfig');
const CursosValidator = require('../validators/cursosValidaciones');

const cursosController = new CursosCTR();

router.get("/", async (req, res) => await cursosController.getCourses(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await cursosController.getCourses(req, res));
router.get("/usuario", Middlewares.validateJWTMiddleware, async (req, res) => await cursosController.getCourses(req, res));
router.post("/", Middlewares.validateJWTMiddleware,
  MulterConfig.upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'fichaTecnica', maxCount: 1 }]),
  CursosValidator.postCourseValidation,
  async (req, res) => await cursosController.postulateCourse(req, res))
router.put("/:idCurso/aprobar", Middlewares.validateAdminMiddleware,
  CursosValidator.aprobeCourseValidation,
  async (req, res) => await cursosController.aprobeCourse(req, res))
router.put("/:idCurso/update", Middlewares.validateJWTMiddleware,
  CursosValidator.updateCorseFieldValidation,
  async (req, res) => await cursosController.updateFieldCourse(req, res))
router.put("/:idCurso/update-files", Middlewares.validateJWTMiddleware,
  MulterConfig.upload.single('file'),
  CursosValidator.updateFilesCurso,
  async (req, res) => await cursosController.updateFilesCourse(req, res))

module.exports = router;