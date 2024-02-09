// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multerConfig = require('../config/MulterConfig');
// ■► Express Validator ◄■:
const { check } = require('express-validator');
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

router.post("/create", multerConfig.upload.single('logo'), [
  check('email').trim().notEmpty().isEmail().custom(async (email) => {
    const existsEmail = await UsersModel.findOne({ where: { email } })
    if (existsEmail) return Promise.reject('El correo electronico ya se encuentra registrado');
  }),
  check('nombre').trim().notEmpty().isString().isLength({ max: 40 }),
  check('telefono').trim().optional({ nullable: true }).isInt().isLength({ max: 11 }),
  check('password').trim().notEmpty().withMessage('La contraseña es obligatoria'),
  check('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  Middlewares.scan_errors
], usersController.registerUser);

module.exports = router;