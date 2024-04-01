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
//router.put()


module.exports = router;