// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Multer / formData object parser ◄■:
const multerConfig = require('../config/MulterConfig');
// ■► Express Validator ◄■:
const { check, body } = require('express-validator');
const CustomMessages = require('../helpers/customMessages');
//■► CONTROLADOR:  ◄■:
const UsersCTR = require('../controllers/users.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const { validateFieldUnique } = require('../helpers/helpers');

//■► Instancia controlador:  ◄■:
const usersController = new UsersCTR();
//■► Instancia Mensajes Validador:  ◄■:
const customMessages = CustomMessages.getValidationMessages();
//■► Router:  ◄■:
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.get("/list", Middlewares.validateJWTMiddleware, async (req, res) => await usersController.getUsers(req, res));

router.post("/create", multerConfig.upload.single('logo'), [
  check('email').trim().notEmpty().withMessage(customMessages.required).isEmail().withMessage(customMessages.email).custom(async (email) => {
    const exists = await validateFieldUnique('user', 'email', email)
    if (exists) return Promise.reject('El correo electronico ya se encuentra registrado');
  }),
  check('nombre').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 40 }).withMessage(customMessages.length),
  check('telefono').trim().optional({ nullable: true }).isInt().withMessage(customMessages.int).isLength({ max: 11 }).withMessage(customMessages.length),
  check('password').trim().notEmpty().withMessage(customMessages.required),
  check('cargo').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 70 }).withMessage(customMessages.length),
  check('tipo').notEmpty().isInt({ min: 1, max: 1 }),
  Middlewares.scan_errors
], usersController.registerUser);

router.post("/create/dashboard", Middlewares.validateAdminMiddleware, multerConfig.upload.single('logo'), [
  body('nombre').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 40 }).withMessage(customMessages.length),
  check('cargo').trim().notEmpty().withMessage(customMessages.required).isString().withMessage(customMessages.string).isLength({ max: 70 }).withMessage(customMessages.length),
  check('telefono').trim().optional({ nullable: true }).isInt().withMessage(customMessages.int).isLength({ max: 11 }).withMessage(customMessages.length),
  check('tipo').notEmpty().withMessage(customMessages.required).isInt({ min: 1, max: 4 }).withMessage(customMessages.int),
  check('email').trim().notEmpty().withMessage(customMessages.required).isEmail().withMessage(customMessages.email).custom(async (email) => {
    const exists = await validateFieldUnique('user', 'email', email)
    if (exists) return Promise.reject('El correo electronico ya se encuentra registrado');
  }),
  check('nombreEntidad').trim().isString().withMessage(customMessages.string).isLength({ max: 120 }).withMessage(customMessages.length).custom(async (nombre, { req }) => {
    if (req.body.tipo != 1) {
      if (!nombre) return Promise.reject('El nombre de la entidad es obligatorio');
      const exists = await validateFieldUnique('entidad', 'nombre', nombre)
      if (exists) return Promise.reject('Ya existe una entidad con ese nombre');
    }
  }),
  check('descripcion').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length).custom(async (descripcion, { req }) => {
    if (req.body.tipo != 1 && !descripcion) return Promise.reject('La descripcion de la entidad es obligatoria');
  }),
  check('sigla').trim().isString().withMessage(customMessages.string).isLength({ max: 10 }).withMessage(customMessages.length).custom(async (sigla, { req }) => {
    if (req.body.tipo != 1 && !sigla) return Promise.reject('Las siglas de la entidad son obligatoria');
  }),
  check('tipoEntidad').custom(async (tipoEntidad, { req }) => {
    if (req.body.tipo != 1 && !tipoEntidad) return Promise.reject('El tipo de la entidad es obligatorio');
  }),
  check('idTipoNaturalezaJuridica').custom(async (tipoNaturaleza, { req }) => {
    if (req.body.tipo != 1 && !tipoNaturaleza) return Promise.reject('El tipo de naturaleza de la entidad es obligatorio');
  }),
  check('direccion').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length).custom(async (direccion, { req }) => {
    if (req.body.tipo != 1 && !direccion) return Promise.reject('La direccion de la entidad es obligatoria');
  }),
  check('telefonoEntidad').trim().isLength({ max: 11 }).withMessage(customMessages.length).custom(async (telefono, { req }) => {
    if (req.body.tipo != 1 && !telefono) return Promise.reject('El telefono de la entidad es obligatorio');
  }),
  check('emailEntidad').trim().custom(async (email, { req }) => {
    if (req.body.tipo != 1 && !email) return Promise.reject('El email de la entidad es obligatorio');
  }),
  check('urlDominio').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  check('urlFacebook').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  check('urlTwitter').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  check('urlLinkedin').trim().isString().withMessage(customMessages.string).isLength({ max: 80 }).withMessage(customMessages.length),
  Middlewares.scan_errors
], usersController.registerUser);

module.exports = router;