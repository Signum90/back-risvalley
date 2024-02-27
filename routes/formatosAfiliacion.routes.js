const { Router } = require('express');
const { param, check } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const FormatosAfilicacionCTR = require('../controllers/formatosAfiliacion.controller');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

const formatosAfiliacionController = new FormatosAfilicacionCTR();

router.get("/", async (req, res) => await formatosAfiliacionController.getFormatActive(req, res));
router.get("/lista", Middlewares.validateAdminMiddleware, async (req, res) => await formatosAfiliacionController.getAllFormats(req, res));
router.post("/", Middlewares.validateAdminMiddleware, multerConfig.upload.single('file'), [
  check('file').custom(async (file, { req }) => {
    const fileFormat = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!req.file) return Promise.reject('La ficha tecnica es obligatoria');
    if (!fileFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.postFormat(req, res));
router.put("/:idFormato/activar", Middlewares.validateAdminMiddleware, [
  param('idFormato').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('formato', id)
    if (!exists) return Promise.reject('Id formato no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.activateFormat(req, res))
router.delete("/:idFormato/eliminar", Middlewares.validateAdminMiddleware, [
  param('idFormato').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('formato', id)
    if (!exists) return Promise.reject('Id formato no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await formatosAfiliacionController.deleteFormat(req, res));

module.exports = router;