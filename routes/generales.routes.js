const { Router } = require('express');
const router = Router();
const GeneralsCTR = require('../controllers/generals.controller');
const Middlewares = require('../middlewares/middlewares');

const generalsController = new GeneralsCTR();

router.get("/estadisticas", async (req, res) => await generalsController.getStadisticsSoftware(req, res));
router.post("/script-entidades", Middlewares.validateAdminMiddleware, async (req, res) => await generalsController.postMasiveEntity(req, res));

module.exports = router;