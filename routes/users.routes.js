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
const UsersCTR = require('../controllers/users.controller');
//■► Middlewares:  ◄■: 
const Middlewares = require('../middlewares/middlewares');

//■► Instancia controlador:  ◄■: 
const users_ctr = new UsersCTR();
//■► Router:  ◄■: 
const router = Router();
//■► Multer:  ◄■: 
const upload = multer();

//■► RUTEO: ===================================== ◄■: 
//■► POST'S: ◄■: 
router.post("/create", upload.none(), [
  check(["nombre","telefono","email","password"], "empty").not().isEmpty(),
  Middlewares.scan_errors
],users_ctr.create_users);
// console.log("rutas ctr");
//■► GET'S: ◄■: 
//■► PUT'S: ◄■: 
//■► DELETES'S: ◄■: 

module.exports = router;