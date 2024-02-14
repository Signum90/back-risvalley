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
const { validateFieldUnique } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const usersController = new UsersCTR();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await usersController.getUsers(req, res));

router.post("/create", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), [
  check('email').trim().notEmpty().isEmail().custom(async (email) => {
    const existsEmail = await UsersModel.findOne({ where: { email } })
    if (existsEmail) return Promise.reject('El correo electronico ya se encuentra registrado');
  }),
  check('nombreEntidad').trim().isString().isLength({ max: 120 }).custom(async (nombre, {req}) => {
    if(req.body.tipo != 1){
      const exists = await validateFieldUnique('entidad', 'nombre', nombre)
      if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
    }
  }),
  check('nombre').trim().notEmpty().isString().isLength({ max: 40 }),
  check('cargo').trim().notEmpty().isString().isLength({ max: 70 }),
  check('telefono').trim().optional({ nullable: true }).isInt().isLength({ max: 11 }),
  //check('password').trim().notEmpty().withMessage('La contraseña es obligatoria'),
  check('password').trim().custom(async (password, {req}) => {
    if(!req.token){
      if(!password) return Promise.reject('La contraseña es obligatoria');
    }
  }),
  check('tipo').notEmpty().isInt({ min: 1, max: 3 }),
  check('descripcion').trim().isString().isLength({ max: 80 }).custom(async (descripcion, {req}) => {
    if(req.body.tipo != 1 && !descripcion) return Promise.reject('La descripcion de la entidad es obligatoria');
  }),
  check('sigla').trim().isString().isLength({ max: 10 }).custom(async (sigla, {req}) => {
    if(req.body.tipo != 1 && !sigla) return Promise.reject('Las siglas de la entidad son obligatoria');
  }),
  check('tipoEntidad').custom(async (tipoEntidad, {req}) => {
    if(req.body.tipo != 1 && !tipoEntidad) return Promise.reject('El tipo de la entidad es obligatorio');
  }),
  check('idTipoNaturalezaJuridica').custom(async (tipoNaturaleza, {req}) => {
    if(req.body.tipo != 1 && !tipoNaturaleza) return Promise.reject('El tipo de naturaleza de la entidad es obligatorio');
  }),
  check('direccion').trim().isString().isLength({ max: 80 }).custom(async (direccion, {req}) => {
    if(req.body.tipo != 1 && !direccion) return Promise.reject('La direccion de la entidad es obligatoria');
  }),
  check('urlDominio').trim().isString().isLength({ max: 80 }),
  check('urlFacebook').trim().isString().isLength({ max: 80 }),
  check('urlTwitter').trim().isString().isLength({ max: 80 }),
  check('urlLinkedin').trim().isString().isLength({ max: 80 }),
  Middlewares.scan_errors
], usersController.registerUser);

module.exports = router;