const { Router } = require('express');
const { param, check, query } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const CiudadesDepartamentosCTR = require('../controllers/ciudadesDepartamentos.controller')
const { validateExistId } = require('../helpers/helpers');
const middlewares = require('../middlewares/middlewares');

const ciudadesDepartamentosController = new CiudadesDepartamentosCTR();

router.get("/", async (req, res) => await ciudadesDepartamentosController.selectDepartamentos(req, res));
router.post("/ciudades", Middlewares.validateJWTMiddleware, async (req, res) => await ciudadesDepartamentosController.departamentosYCiudades(req, res));
router.get("/:idDepartamento/ciudades", [
  param('idDepartamento').notEmpty().isInt().custom(async (id) => {
    const exists = await validateExistId('departamento', id)
    if (!exists) return Promise.reject('Id departamento no válido');
  }),
  middlewares.scan_errors
], async (req, res) => await ciudadesDepartamentosController.selectCiudades(req, res));
module.exports = router;