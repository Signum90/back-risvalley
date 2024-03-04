const { Router } = require('express');
const { param, check, query } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const FormatosAfilicacionCTR = require('../controllers/formatosAfiliacion.controller');
const { validateExistId } = require('../helpers/helpers');
const CustomMessages = require('../helpers/customMessages');

const customMessages = CustomMessages.getValidationMessages();
const formatosAfiliacionController = new FormatosAfilicacionCTR();

router.get("/", [
  query('tipo').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 2 }).withMessage('El tipo debe ser un número entre 1 y 2'),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.getFormatActive(req, res));
router.get("/lista", [
  query('tipo').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 2 }).withMessage('El tipo debe ser un número entre 1 y 2'),
  Middlewares.scan_errors
], Middlewares.validateAdminMiddleware, async (req, res) => await formatosAfiliacionController.getAllFormats(req, res));
router.post("/", Middlewares.validateAdminMiddleware, multerConfig.upload.single('file'), [
  check('file').custom(async (file, { req }) => {
    const fileFormat = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!req.file) return Promise.reject('El formato de afiliación es obligatorio');
    if (!fileFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
  }),
  check('tipo').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 2 }).withMessage('El tipo debe ser un número entre 1 y 2'),
  check('fechaInicioFormato').notEmpty().withMessage(customMessages.required),
  check('fechaFinFormato').notEmpty().withMessage(customMessages.required).custom(async (fechaFin, { req }) => {
    if (new Date(req.body.fechaInicioFormato) > new Date(fechaFin)) return Promise.reject('La fecha de cierre debe ser mayor a la de inicio');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.postFormat(req, res));
router.put("/:idFormato/activar", Middlewares.validateAdminMiddleware, [
  param('idFormato').notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('formato', id)
    if (!exists) return Promise.reject('Id formato no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.activateFormat(req, res))
router.delete("/:idFormato/eliminar", Middlewares.validateAdminMiddleware, [
  param('idFormato').notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('formato', id)
    if (!exists) return Promise.reject('Id formato no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.deleteFormat(req, res));

module.exports = router;