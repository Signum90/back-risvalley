const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const UsersModel = require('../models/Users');
const { urlFiles } = require('../config/config');
const NotificacionesModel = require('../models/Notificaciones');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');

class NotificacionesCTR {
  async getNotifications(req, res) {
    try {
      const { token } = req;

      const myServices = await ServiciosTecnologicosModel.findAll({ where: { createdBy: token.id } })

      const notifications = await NotificacionesModel.findAll({
        attributes: [
          'id',
          'idServicio',
          'contactoNombre',
          'contactoCorreo',
          'contactoTelefono',
          'userActivo',
          [literal('(SELECT s.nombre FROM servicios_tecnologicos AS s WHERE s.id = idServicio)'), 'nombreServicio']
        ],
        where: {
          idServicio: {
            [Op.in]: myServices.map((e) => e.id)
          }
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

      const postData = {
        idServicio: body.idServicio,
        contactoNombre: user.nombre,
        contactoCorreo: user.email,
        contactoTelefono: user.telefono,
        userActivo: token ? 1 : 0,
        createdBy: token ? token.id : null
      }

      const model = await NotificacionesModel.create(postData, { transaction: t });
      return res.status(200).json({ data: model, msg: 'success' });
    })
  }
}

module.exports = NotificacionesCTR;