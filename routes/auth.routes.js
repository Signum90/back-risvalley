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
const authCTR = require('../controllers/auth.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■:
const authController = new authCTR();
//■► Router:  ◄■:
const router = Router();
//■► Multer:  ◄■:
const upload = multer();

//■► RUTEO: ===================================== ◄■:
router.post("/login", [
    check(["correo", "password"], "empty").not().isEmpty(),
    Middlewares.scan_errors
], async (req, res) => await authController.login(req, res));

router.post("/logout", Middlewares.logoutMiddleware , async (req, res) =>{
    res.status(200).json({ data: true, msg: 'Logout exitoso' });
});

module.exports = router;