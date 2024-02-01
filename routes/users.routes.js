// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multer = require('multer');
// ■► Express Validator ◄■:
const { body } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const UsersCTR = require('../controllers/users.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const UsersModel = require('../models/Users');

//■► Instancia controlador:  ◄■:
const usersController = new UsersCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await usersController.getUsers(req, res));

router.post("/create", Middlewares.validateJWTMiddleware, [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser una cadena de caracteres')
    .isLength({ max: 40 }).withMessage('El nombre debe tener como máximo 255 caracteres'),
  body('email').trim().notEmpty().isEmail().custom(async (email) => {
    const existsEmail = await UsersModel.findOne({ where: { email } })
    if (existsEmail) return Promise.reject('El correo electronico ya se encuentra registrado');
  }),
  body('telefono')
    .trim()
    .optional({ nullable: true })
    .isInt().withMessage('El teléfono debe ser un número entero')
    .isLength({ max: 11 }).withMessage('El teléfono debe tener como máximo 11 caracteres'),
  body('password')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria'),
  Middlewares.scan_errors
], usersController.registerUser);

module.exports = router;