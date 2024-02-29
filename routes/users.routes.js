// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multerConfig = require('../config/MulterConfig');
//■► CONTROLADOR:  ◄■:
const UsersCTR = require('../controllers/users.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const UsersValidator = require('../validators/usersValidaciones');

//■► Instancia controlador:  ◄■:
const usersController = new UsersCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateAdminMiddleware, async (req, res) => await usersController.getUsers(req, res));
router.get("/select", Middlewares.validateAdminMiddleware, async (req, res) => await usersController.getSelectUsers(req, res));
router.post("/create", multerConfig.upload.single('logo'), UsersValidator.userValidator, usersController.registerUser);
router.put("/:idUser/update", Middlewares.validateJWTMiddleware, UsersValidator.userUpdateValidate, usersController.updateUser);
router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), UsersValidator.userDashboardValidate, usersController.registerUser);
router.put("/:idUser/update-logo", Middlewares.validateJWTMiddleware, multerConfig.upload.single('logo'), UsersValidator.updateLogoValidator, async (req, res) => await usersController.updateLogoUser(req, res));

module.exports = router;