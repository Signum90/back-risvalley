const { Router } = require('express');
const { param, check, body, query } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const ServiciosTecnologicosCTR = require('../controllers/serviciosTecnologicos.controller');
const { validateExistId } = require('../helpers/helpers');
const CustomMessages = require('../helpers/customMessages');

const customMessages = CustomMessages.getValidationMessages();
const serviciosTecnologicosController = new ServiciosTecnologicosCTR();

router.get("/", async (req, res) => await serviciosTecnologicosController.getTechnologicalService(req, res));
router.get("/usuario", Middlewares.validateJWTMiddleware, async (req, res) => await serviciosTecnologicosController.getMyServices(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await serviciosTecnologicosController.getTechnologicalService(req, res));
router.get("/:idServicio/detalle", [
  param('idServicio').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.getDetailService(req, res));

router.post("/", Middlewares.validateJWTMiddleware, multerConfig.upload.single('imagen'), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 150 }),
  check('idTipoServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  check('idTipoClienteServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  check('imagen').custom(async (imagen, { req }) => {
    const imageFormat = ['image/jpeg', 'image/png'];
    if (!req.file) return Promise.reject('El campo imagen es obligatorio');
    if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
  }),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.postTechnologicalService(req, res));

router.post("/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('imagen'), [
  check('idUserContacto').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 150 }),
  check('idTipoServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  check('idTipoClienteServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  check('imagen').custom(async (imagen, { req }) => {
    const imageFormat = ['image/jpeg', 'image/png'];
    if (!req.file) return Promise.reject('El campo imagen es obligatorio');
    if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
  }),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.postTechnologicalServiceFromDashboard(req, res));


router.put("/:idServicio/update", Middlewares.validateJWTMiddleware, [
  param('idServicio').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  body('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  body('descripcion').trim().notEmpty().isString().isLength({ max: 150 }),
  body('idTipoServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  body('idTipoClienteServicio').notEmpty().isInt().custom(async (id) => {
    const tipo = await validateExistId('tipo', id);
    if (!tipo) return Promise.reject('Id tipo no válido');
  }),
  body('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.updateTechnologicalService(req, res))

router.put("/:idServicio/update-image", Middlewares.validateJWTMiddleware, multerConfig.upload.single('imagen'), [
  param('idServicio').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  check('imagen').custom(async (imagen, { req }) => {
    const imageFormat = ['image/jpeg', 'image/png'];
    if (!req.file) return Promise.reject('El campo imagen es obligatorio');
    if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
  }),
  check('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.updateLogoService(req, res));

router.put("/:idServicio/aprobar", Middlewares.validateAdminMiddleware, [
  param('idServicio').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  body('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.aprobeTechnologicalService(req, res))

router.delete("/:idServicio/delete", Middlewares.validateJWTMiddleware, [
  param('idServicio').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  query('keydata').trim().notEmpty().withMessage(customMessages.required),
  Middlewares.scan_errors
], async (req, res) => await serviciosTecnologicosController.deleteService(req, res))

module.exports = router;