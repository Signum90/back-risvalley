const { Router } = require('express');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const multerConfig = require('../config/MulterConfig');
const EventosCTR = require('../controllers/eventos.controller');
const EventosValidator = require('../validators/eventosValidator');

const eventosController = new EventosCTR();


//■► RUTEO: ===================================== ◄■:
router.get("/list", async (req, res) => await eventosController.getEvents(req, res));
router.get("/dashboard", Middlewares.validateAdminMiddleware, async (req, res) => await eventosController.getEventsDashboard(req, res));
router.post("/create", Middlewares.validateJWTMiddleware,
  multerConfig.upload.single('logo'),
  EventosValidator.createEventValidator,
  eventosController.saveEvent);
router.post("/create/dashboard", Middlewares.validateAdminMiddleware,
  multerConfig.upload.single('logo'),
  EventosValidator.createEventDashboardValidator,
  eventosController.saveEvent);
router.put("/:idEvento/update-logo", Middlewares.validateJWTMiddleware,
  multerConfig.upload.single('logo'),
  EventosValidator.editEventLogoValidator,
  async (req, res) => await eventosController.updateLogoEvent(req, res));
router.put("/:idEvento/update/field", Middlewares.validateJWTMiddleware,
  EventosValidator.editFieldEventValidator,
  async (req, res) => await eventosController.updateEventField(req, res));
router.put("/:idEvento/update", Middlewares.validateJWTMiddleware,
  EventosValidator.updateEventValidator,
  async (req, res) => await eventosController.updateEvent(req, res));
router.put("/:idEvento/aprobar", Middlewares.validateAdminMiddleware,
  EventosValidator.aprobeEventValidator,
  async (req, res) => await eventosController.aprobeEvent(req, res))
router.delete("/:idEvento/delete", Middlewares.validateJWTMiddleware,
  EventosValidator.deleteEventValidator,
  async (req, res) => await eventosController.deleteEvent(req, res))
module.exports = router;