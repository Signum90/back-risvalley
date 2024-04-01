const { Router } = require('express');
const { param, check } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const RetosAspirantesCTR = require('../controllers/retosAspirantes.controller');
const { validateExistId, validateFieldUnique, validateFieldUnique2 } = require('../helpers/helpers');

const retosAspirantesController = new RetosAspirantesCTR();

//■► RUTEO: ===================================== ◄■:
router.get("/:idReto/aspirantes", Middlewares.validateJWTMiddleware, async (req, res) => await retosAspirantesController.getCandidatesChallenge(req, res));
router.get("/aspiraciones", Middlewares.validateJWTMiddleware, async (req, res) => await retosAspirantesController.getMyCandidacy(req, res));

router.post("/aspirantes/create", Middlewares.validateJWTMiddleware, multerConfig.upload.single('fichaTecnica'), [
  check('fichaTecnica').custom(async (ficha, { req }) => {
    if (!req.file) return Promise.reject('La ficha tecnica es obligatoria');
  }),
  check('idReto').notEmpty().isInt().custom(async (id, { req }) => {
    const exists = await validateExistId('reto', id)
    const unique = await validateFieldUnique('retoAspirante', { 'id_reto': id, 'id_user_aspirante': req.token.id })
    if (!exists) return Promise.reject('Id reto no válido');
    if (unique) return Promise.reject('El aspirante ya se encuentra registrado');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosAspirantesController.saveCandidateChallenge(req, res))

router.put("/aspirantes/:idRetoAspirante/seleccionar", Middlewares.validateJWTMiddleware, [
  param('idRetoAspirante').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('retoAspirante', id)
    if (!exists) return Promise.reject('Id no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await retosAspirantesController.chooseAplicant(req, res));

router.delete("/aspirantes/:idRetoAspirante/delete", [
  param('idRetoAspirante').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('retoAspirante', id)
    if (!exists) return Promise.reject('Id no válido');
  }),
  Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await retosAspirantesController.removeCandidateChallenge(req, res));

module.exports = router;