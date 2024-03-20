const { Router } = require('express');
const GeneralsCTR = require('../controllers/generals.controller');

const generalsController = new GeneralsCTR();

const router = Router();

router.get("/", async (req, res) => await generalsController.getStadisticsSoftware(req, res));
  
module.exports = router;