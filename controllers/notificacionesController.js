const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const UsersModel = require('../models/Users');
const { urlFiles } = require('../config/config');
const NotificacionesModel = require('../models/Notificaciones');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const { saveNotification } = require('../helpers/helpers');

class NotificacionesCTR {
  async getNotifications(req, res) {
    try {
      const { token } = req;

      const notifications = await NotificacionesModel.findAll({
        attributes: [
          'id',
          'idServicio',
          'idUser',
          'idReto',
          'idRetoAspirante',
          'contactoNombre',
          'contactoCorreo',
          'contactoTelefono',
          'userActivo',
          'tipo',
          'comentario',
          'notificacion',
          'idPqr',
          [literal(`COALESCE(
            (SELECT s.nombre FROM servicios_tecnologicos AS s WHERE s.id = idReto),
            (SELECT r.nombre FROM retos_tecnologicos AS r WHERE r.id = idReto),
            (SELECT r.nombre FROM retos_aspirantes AS ra INNER JOIN retos_tecnologicos AS r ON r.id = ra.id_reto WHERE ra.id = idRetoAspirante)
          )`), 'nombre']
        ],
        where: {
          ...(token.superadmin ? { idUser: null } : { idUser: token.id }),
        },
        order: [['createdAt', 'Desc']],
        limit: 10
      })

      return res.status(200).json({ data: notifications, msg: 'success' });
    } catch (error) {
      throw error;
    }
  }

  async saveContactService(req, res) {
    return await sequelize.transaction(async (t) => {
      const { body, token } = req;
      let user = {};
      if (token) {
        user = await UsersModel.findByPk(token.id)
      } else {
        user = {
          nombre: body.nombre,
          email: body.email,
          telefono: body.telefono
        }
      }
      const service = await ServiciosTecnologicosModel.findByPk(body.idServicio)
      const postData = {
        tipo: 11,
        idServicio: body.idServicio,
        idUser: service.createdBy,
        contactoNombre: user.nombre,
        contactoCorreo: user.email,
        contactoTelefono: user.telefono,
        userActivo: token ? 1 : 0,
        createdBy: token ? token.id : null
      }

      const model = await saveNotification(postData);
      return res.status(200).json({ data: model, msg: 'success' });
    })
  }
}

module.exports = NotificacionesCTR;