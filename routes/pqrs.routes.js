const { Router } = require('express');
const { body } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const PqrsCTR = require('../controllers/pqrs.controller');
const CustomMessages = require('../helpers/customMessages');

const pqrsController = new PqrsCTR();
const customMessages = CustomMessages.getValidationMessages();

router.get("/", Middlewares.validateAdminMiddleware, async (req, res) => await pqrsController.getPQRS(req, res));
router.post("/", [
  body('pqr').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 150 }).withMessage(customMessages.length),
  body('tipo').notEmpty().isInt({ min: 1, max: 4 }),
  Middlewares.scan_errors
], Middlewares.validateJWTMiddleware, async (req, res) => await pqrsController.postPQRS(req, res));

module.exports = router;