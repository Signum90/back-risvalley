const { Router } = require('express');
const { body, check, param, query, validationResult } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const BibliotecaCTR = require('../controllers/biblioteca.controller')
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');
const MulterConfig = require('../config/MulterConfig');

const bibliotecaController = new BibliotecaCTR();
const customMessages = CustomMessages.getValidationMessages();
const validations = {
  'nombre': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
  'descripcion': check('value').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 80 caracteres'),
  'autor': check('value').trim().notEmpty().withMessage(customMessages.required).isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
}

router.get("/", async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await bibliotecaController.getFilesLibrary(req, res));
router.post("/", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('file'), [
  check('file').custom(async (file, { req }) => {
    const imageFormat = ['application/pdf'];
    if (!req.file) return Promise.reject('El archivo es obligatorio');
    if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un pdf válido');
  }),
  check('nombre').trim().notEmpty().withMessage(customMessages.required)
    .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
  check('descripcion').trim().notEmpty().withMessage(customMessages.required)
    .isString().withMessage(customMessages.string)
    .isLength({ max: 150 }).withMessage('El campo descripcion debe tener como máximo 80 caracteres'),
  check('autor').trim().notEmpty().withMessage(customMessages.required)
    .isString().isLength({ max: 50 }).withMessage('El campo nombre debe tener como máximo 50 caracteres'),
  Middlewares.scan_errors],
  async (req, res) => bibliotecaController.postFileLibrary(req, res));
router.put("/:idArchivo/update-estado", Middlewares.validateAdminMiddleware, [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  check('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await bibliotecaController.changeStateFile(req, res));
router.put("/:idArchivo/update", Middlewares.validateAdminMiddleware, [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  body('keydata').trim().notEmpty().withMessage(customMessages.required),
  body('value').notEmpty().withMessage(customMessages.required).custom(async (id, { req }) => {
    const validate = validations[req.body.campo]
    if (!validate) return Promise.reject('Campo no válido');
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors
], async (req, res) => bibliotecaController.updateFieldsFile(req, res));
router.put("/:idArchivo/update-file", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('file'), [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  check('keydata').trim().notEmpty().withMessage(customMessages.required),
  check('file').custom(async (file, { req }) => {
    const imageFormat = ['application/pdf'];
    if (!req.file) return Promise.reject('El archivo es obligatorio');
    if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Ingrese un pdf válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await bibliotecaController.updateFile(req, res));
router.delete("/:idArchivo/eliminar", Middlewares.validateAdminMiddleware, [
  param('idArchivo').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('archivo', id)
    if (!exists) return Promise.reject('Id archivo no válido');
  }),
  query('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await bibliotecaController.deleteFileLibrary(req, res))

module.exports = router;