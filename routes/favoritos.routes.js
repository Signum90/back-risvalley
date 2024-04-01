const { Router } = require('express');
const { body, param } = require('express-validator');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const FavoritosCTR = require('../controllers/favoritos.controller');
const CustomMessages = require('../helpers/customMessages');
const { validateExistId, validateFieldUnique } = require('../helpers/helpers');

const favoritosController = new FavoritosCTR();
const customMessages = CustomMessages.getValidationMessages();

router.get("/", Middlewares.validateJWTMiddleware, async (req, res) => await favoritosController.getFavorites(req, res));
router.post("/", Middlewares.validateJWTMiddleware, [
  body('tipo').trim().notEmpty().withMessage(customMessages.required)
    .isInt({ min: 1, max: 4 }).withMessage('El tipo debe ser un numero entre 1 y 4'),
  body('id').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id, { req }) => {
    const words = {
      1: { word: 'servicio', key: 'idServicio' },
      2: { word: 'reto', key: 'idReto' },
      3: { word: 'curso', key: 'idCurso' },
      4: { word: 'archivo', key: 'idBiblioteca' }
    }
    const word = words[req.body.tipo];
    const exists = await validateExistId(word.word, id)
    if (!exists) return Promise.reject(`Id ${word.word} no válido`);

    const unique = await validateFieldUnique('favorito', { 'idUser': req.token.id, [word.key]: id })
    if (unique) return Promise.reject(`El ${word.word} ya hace parte de tus favoritos`)

  }),
  Middlewares.scan_errors
], async (req, res) => await favoritosController.postFavorite(req, res))

router.delete("/:idFavorito/eliminar", Middlewares.validateJWTMiddleware, [
  param('idFavorito').trim().notEmpty().withMessage(customMessages.required).isInt().withMessage(customMessages.int).custom(async (id) => {
    const exists = await validateExistId('favorito', id)
    if (!exists) return Promise.reject(`Id favorito no válido`);
  }),
  Middlewares.scan_errors
], async (req, res) => await favoritosController.deleteFavorite(req, res))

module.exports = router;