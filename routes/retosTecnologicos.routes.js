const { Router } = require('express');
const { body, param, check, validationResult } = require('express-validator');
const retosCTR = require('../controllers/retos.controller')
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const retosController = new retosCTR();
//■► Router:  ◄■:
const router = Router();

router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await retosController.getTechnologicalChallenges(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, multerConfig.upload.fields([{ name: 'fichaTecnica', maxCount: 1 }, { name: 'recursoMultimedia', maxCount: 1 }]), [
  check('nombre').trim().notEmpty().isString().isLength({ max: 120 }),
  check('descripcion').trim().notEmpty().isString().isLength({ max: 150 }),
  check('fechaInicioConvocatoria').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a hoy'),
  check('fechaFinConvocatoria').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a hoy').custom(async (fechaFin, { req }) => {
    if (new Date(req.body.fechaInicioConvocatoria) > new Date(fechaFin)) return Promise.reject('La fecha de cierre de la convocatoria debe ser mayor a la de inicio');
  }),
  check('fichaTecnica').custom(async (ficha, { req }) => {
    if (!req.files['fichaTecnica']) return Promise.reject('La ficha tecnica es obligatoria');
  }),
  check('recursoMultimedia').custom(async (recurso, { req }) => {
    if (!req.files['recursoMultimedia']) return Promise.reject('El recurso multimedia es obligatorio');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosController.saveTechnologicalChallenge(req, res));

router.put("/:idReto/update-files", Middlewares.validateJWTMiddleware, multerConfig.upload.single('file'), [
  param('idReto').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('reto', id)
    if (!exists) return Promise.reject('Id reto no válido');
  }),
  check('file').custom(async (ficha, { req }) => {
    if (!req.file) return Promise.reject('El campo file es obligatorio');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosController.updateFilesChallenge(req, res));

router.put("/:idReto/update", Middlewares.validateJWTMiddleware, [
  param('idReto').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('reto', id)
    if (!exists) return Promise.reject('Id reto no válido');
  }),
  body('value').notEmpty().custom(async (value, { req }) => {
    let validate
    switch (req.body.campo) {
      case 'nombre':
        validate = check('value').trim().notEmpty().isString().isLength({ max: 120 })
        break;
      case 'descripcion':
        validate = check('value').trim().notEmpty().isString().isLength({ max: 150 })
        break;
      case 'fechaInicioConvocatoria':
        validate = check('value').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de inicio debe ser mayor a hoy')
        break;
      case 'fechaFinConvocatoria':
        validate = check('value').notEmpty().isAfter(new Date().toString()).withMessage('La fecha de fin debe ser mayor a hoy')
        break;
      default:
        return Promise.reject('Campo no válido');
    }
    //ejecuta la validacion encontrada
    await validate.run(req);
    const errors = validationResult(req);
    //comprueba si hay errores y los retorna
    if (!errors.isEmpty()) return Promise.reject('error');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosController.updateFieldChallenge(req, res));

router.delete("/:idReto/delete", Middlewares.validateJWTMiddleware, [
  param('idReto').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('reto', id)
    if (!exists) return Promise.reject('Id reto no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosController.deleteReto(req, res))


module.exports = router;