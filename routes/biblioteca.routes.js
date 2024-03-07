const { Router } = require('express');
const { body, check, param } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const BibliotecaCTR = require('../controllers/biblioteca.controller')
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');
const MulterConfig = require('../config/MulterConfig');

const bibliotecaController = new BibliotecaCTR();
const customMessages = CustomMessages.getValidationMessages();

router.get("/", async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.post("/", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('file'), [
  check('file').custom(async (file, { req }) => {
    if (!req.file) return Promise.reject('El archivo es obligatorio');
  }),
  Middlewares.scan_errors],
  async (req, res) => bibliotecaController.postFileLibrary(req, res));
router.put("/:idArchivo/update-estado", Middlewares.validateAdminMiddleware, [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await bibliotecaController.changeStateFile(req, res));
router.delete("/:idArchivo/eliminar", Middlewares.validateAdminMiddleware, [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await bibliotecaController.deleteFileLibrary(req, res))

module.exports = router;