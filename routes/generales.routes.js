const { Router } = require('express');
const router = Router();
const GeneralsCTR = require('../controllers/generals.controller');

const generalsController = new GeneralsCTR();

router.get("/estadisticas", async (req, res) => await generalsController.getStadisticsSoftware(req, res));

module.exports = router;