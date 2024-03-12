const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const BibliotecaCTR = require('../controllers/biblioteca.controller')
const MulterConfig = require('../config/MulterConfig');
const BibliotecaValidator = require('../validators/bibliotecaValidaciones');

const bibliotecaController = new BibliotecaCTR();

router.get("/", async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.get("/:idArchivo/detalle", BibliotecaValidator.detailArchivoValidator, async (req, res) => await bibliotecaController.getDetailFile(req, res))
router.post("/", Middlewares.validateAdminMiddleware,
  //MulterConfig.upload.single('file'),
  MulterConfig.upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'libro', maxCount: 1 }]),
  BibliotecaValidator.createLibraryValidator,
  async (req, res) => bibliotecaController.postFileLibrary(req, res));
router.put("/:idArchivo/update-estado", Middlewares.validateAdminMiddleware,
  BibliotecaValidator.updateStateValidator,
  async (req, res) => await bibliotecaController.changeStateFile(req, res));
router.put("/:idArchivo/update", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('file'),
  BibliotecaValidator.updateLibraryFile,
  async (req, res) => bibliotecaController.updateFieldsFile(req, res));
router.put("/:idArchivo/update-file", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('file'), BibliotecaValidator.updateFilesLibrary,
  async (req, res) => await bibliotecaController.updateFile(req, res));
router.delete("/:idArchivo/eliminar", Middlewares.validateAdminMiddleware,
  BibliotecaValidator.deleteFileValidator,
  async (req, res) => await bibliotecaController.deleteFileLibrary(req, res))

module.exports = router;