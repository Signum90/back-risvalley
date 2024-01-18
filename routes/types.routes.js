// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multer = require('multer');
// ■► Express Validator ◄■:
const { check } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const TypesCTR = require('../controllers/types.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const typesController = new TypesCTR();
//■► Router:  ◄■:
const router = Router();
//■► Multer:  ◄■:
const upload = multer();

//■► RUTEO: ===================================== ◄■:
//■► POST'S: ◄■:
router.post("/create", upload.none(), async (req, res) => await typesController.saveTypes(req, res));
// console.log("rutas ctr");
//■► GET'S: ◄■:
//■► PUT'S: ◄■:
//■► DELETES'S: ◄■:

module.exports = router;