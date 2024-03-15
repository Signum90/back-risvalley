const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const CursosEstudiantesCTR = require('../controllers/cursosEstudiantes.controller')
const CustomMessages = require('../helpers/customMessages');
const { body, param } = require('express-validator');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

const cursosEstudiantesController = new CursosEstudiantesCTR();
const customMessages = CustomMessages.getValidationMessages();

router.post('/adquirir', Middlewares.validateJWTMiddleware, [
  body('idCurso').trim().notEmpty().withMessage(customMessages.required).custom(async (id, { req }) => {
    const exists = await validateExistId('curso', id)
    if (!exists) return Promise.reject('Id curso no válido');
    const unique = await validateFieldUnique('cursoEstudiante', 'idUser', req.token.id, null, 'idCurso', id)
    if (unique) return Promise.reject('El usuario ya está inscrito en el curso ')
  }),
  Middlewares.scan_errors
], async (req, res) => await cursosEstudiantesController.acquireCourse(req, res));

router.put('/:idCursoEstudiante/update-estado', Middlewares.validateAdminMiddleware, [
  param('idCursoEstudiante').trim().notEmpty().withMessage(customMessages.required).custom(async (id) => {
    const exists = await validateExistId('curso', id)
    if (!exists) return Promise.reject('Id curso no válido');
  }),
  Middlewares.scan_errors
], async (req, res) => await cursosEstudiantesController.updateStateSubscripcion(req, res));


module.exports = router;