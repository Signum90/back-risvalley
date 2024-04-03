const { Router } = require('express');
const { body, check, param } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const PqrsCTR = require('../controllers/pqrs.controller');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');
const MulterConfig = require('../config/MulterConfig');

const pqrsController = new PqrsCTR();
const customMessages = CustomMessages.getValidationMessages();

router.get("/", Middlewares.validateAdminMiddleware, async (req, res) => await pqrsController.getPQRS(req, res));
router.get("/:idPqr/detalle", Middlewares.validateJWTMiddleware, [
  param('idPqr').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('pqr', id)
    if (!exists) return Promise.reject('Id pqr no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await pqrsController.getDetailPQRS(req, res));
router.post("/", [
  body('pqr').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage(customMessages.length),
  body('tipo').notEmpty().isInt({ min: 1, max: 5 }),
  Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await pqrsController.postPQRS(req, res));
router.post("/invitado", [
  body('pqr').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage(customMessages.length),
  body('tipo').notEmpty().isInt({ min: 1, max: 5 }),
  body('nombre').trim().notEmpty().withMessage(customMessages.required)
    .isString().isLength({ max: 120 }).withMessage('El campo nombre debe tener como máximo 120 caracteres'),
  body('email').trim().notEmpty().withMessage(customMessages.required)
    .isEmail().withMessage(customMessages.email)
    .isString().withMessage(customMessages.string)
    .isLength({ max: 80 }).withMessage('El campo email debe tener como máximo 80 caracteres'),
  body('telefono').trim().notEmpty().withMessage(customMessages.required)
    .isInt().withMessage(customMessages.int)
    .isLength({ max: 11 }).withMessage('El campo telefono debe tener como máximo 11 caracteres'),
  Middlewares.scan_errors
], async (req, res) => pqrsController.postPQRS(req, res))

router.put("/:idPqr/soporte", Middlewares.validateAdminMiddleware, MulterConfig.upload.single('imagenSoporte'), [
  param('idPqr').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('pqr', id)
    if (!exists) return Promise.reject('Id pqr no válido');
  }),
  check('soporte').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage(customMessages.length),
  check('imagenSoporte').custom(async (imagen, { req }) => {
    const imageFormat = ['image/jpeg', 'image/png'];
    if (req?.file) {
      if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
    }
  }),
  Middlewares.scan_errors
], async (req, res) => await pqrsController.resolvePQR(req, res))

module.exports = router;