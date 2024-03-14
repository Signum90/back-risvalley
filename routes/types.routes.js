// ############################################
// ######### RUTAS: USUARIOS ##################
// ###########################################
//■► PAQUETES EXTERNOS:  ◄■:
const { Router } = require('express');
// ■► Express Validator ◄■:
const { query, check } = require('express-validator');
//■► CONTROLADOR:  ◄■:
const TypesCTR = require('../controllers/types.controller');
//■► Middlewares:  ◄■:
const Middlewares = require('../middlewares/middlewares');
const MulterConfig = require('../config/MulterConfig');
const CustomMessages = require('../helpers/customMessages');

//■► Instancia controlador:  ◄■:
const typesController = new TypesCTR();
//■► Router:  ◄■:
const customMessages = CustomMessages.getValidationMessages();
const router = Router();

//■► RUTEO: ===================================== ◄■:
router.post("/create", Middlewares.validateJWTMiddleware, async (req, res) => await typesController.saveTypes(req, res));
router.post("/create-categoria", Middlewares.validateAdminMiddleware,
  MulterConfig.upload.single('imagen'), [
  check('nombre').trim().notEmpty().withMessage(customMessages.required)
    .isString().withMessage(customMessages.string)
    .isLength({ max: 70 }).withMessage('El campo nombre debe tener máximo 70 caracteres'),
  check('imagen').custom(async (imagen, { req }) => {
    if (req?.file) {
      const imageFormat = ['image/jpeg', 'image/png'];
      if (!imageFormat.includes(req.file.mimetype)) return Promise.reject('Por favor ingrese una imagen valida');
    } else {
      return Promise.reject('La imagen de la categoria es obligatoria')
    }
  }),
  Middlewares.scan_errors
], async (req, res) => await typesController.postCategory(req, res))
router.get("/list", [
  query('tipo')
    .trim()
    .notEmpty().withMessage('El campo "tipo" es requerido')
    .isInt({ min: 1, max: 4 }).withMessage('El campo "tipo" debe ser un número entero entre 1 y 3'),
  Middlewares.scan_errors
], async (req, res) => await typesController.getTypes(req, res));

module.exports = router;