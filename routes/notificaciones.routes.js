const { Router } = require('express');
const { body, param } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const NotificacionesCTR = require('../controllers/notificacionesController')
const CustomMessages = require('../helpers/customMessages');
const { validateExistId } = require('../helpers/helpers');

const notificacionesController = new NotificacionesCTR();
const customMessages = CustomMessages.getValidationMessages();

router.get("/", Middlewares.validateJWTMiddleware, async (req, res) => await notificacionesController.getNotifications(req, res));

router.post("/", Middlewares.validateJWTMiddleware, [
  body('idServicio').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await notificacionesController.saveContactService(req, res));

router.post("/rechazar-postulacion", Middlewares.validateJWTMiddleware, [
  body('idReto').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('reto', id)
    if (!exists) return Promise.reject('Id reto no válido');
  }),
  body('idUser').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('user', id)
    if (!exists) return Promise.reject('Id user no válido');
  }),
  body('comentario').trim().notEmpty().withMessage(customMessages.required)
    .isString().isLength({ max: 70 }).withMessage('El campo comentario debe tener como máximo 70 caracteres'),
  Middlewares.scan_errors
], async (req, res) => await notificacionesController.postNotificationComentario(req, res));

router.post("/invitado", [
  body('idServicio').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('servicio', id)
    if (!exists) return Promise.reject('Id servicio no válido');
  }),
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
], async (req, res) => await notificacionesController.saveContactService(req, res))

router.put("/:idNotificacion/update-estado", Middlewares.validateJWTMiddleware, [
  param('idNotificacion').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('notificacion', id)
    if (!exists) return Promise.reject('Id notificación no válido');
  }),
], async (req, res) => await notificacionesController.updateStateNotification(req, res))

module.exports = router;