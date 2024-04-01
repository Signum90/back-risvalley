const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const CursosClasesCTR = require('../controllers/cursosClases.controller');
const MulterConfig = require('../config/MulterConfig');
const ClasesValidator = require('../validators/clasesValidaciones');

const cursosClasesController = new CursosClasesCTR();

router.get("/:idClase/detalle", Middlewares.validateJWTMiddleware,
  ClasesValidator.validateIdClass,
  async (req, res) => await cursosClasesController.getClassDetail(req, res));
router.post("/", Middlewares.validateJWTMiddleware,
  MulterConfig.upload.single('file'),
  ClasesValidator.postClassValidator,
  async (req, res) => await cursosClasesController.postClassCourse(req, res));
router.put("/:idClase/update", Middlewares.validateJWTMiddleware,
  ClasesValidator.updateFieldClass,
  async (req, res) => await cursosClasesController.putFieldClassCourse(req, res));
router.put("/:idClase/update-file", Middlewares.validateJWTMiddleware,
  MulterConfig.upload.single('file'),
  ClasesValidator.updateFileValidator,
  async (req, res) => await cursosClasesController.putFileClassCourse(req, res));
router.delete("/:idClase/eliminar", Middlewares.validateJWTMiddleware,
  ClasesValidator.validateIdClass,
  async (req, res) => await cursosClasesController.deleteClassCourse(req, res));

module.exports = router;