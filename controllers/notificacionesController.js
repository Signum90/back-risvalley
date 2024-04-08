const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const UsersModel = require('../models/Users');
const NotificacionesModel = require('../models/Notificaciones');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const { saveNotification } = require('../helpers/helpers');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const EventosModel = require('../models/Eventos');
const CursosModel = require('../models/Cursos');
const PqrsModel = require('../models/Pqrs');
const RetosAspirantesModel = require('../models/RetosAspirantes');

class NotificacionesCTR {
  async getNotifications(req, res) {
    try {
      const { token } = req;

      const notifications = await NotificacionesModel.findAll({
        attributes: [
          'id',
          'idServicio',
          'idCurso',
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
          'idEvento',
          'createdAt',
          'tipoLabel'
        ],
        where: {
          ...(token.superadmin ? {
            idUser: {
              [Op.is]: null,
            }
          } : { idUser: token.id }),
          estado: 0
        },
        include: [{
          model: ServiciosTecnologicosModel, as: 'servicio', attributes: [
            'nombre',
            'keydata',
          ], required: false
        },
        {
          model: RetosTecnologicosModel, as: 'reto', attributes: [
            'nombre',
            'keydata',
          ], required: false
        },
        {
          model: RetosAspirantesModel, as: 'retoAspirante', attributes: [
            [literal(`(SELECT r.nombre FROM retos_tecnologicos AS r WHERE r.id = retoAspirante.id_reto)`), 'nombre'],
            [literal(`(SELECT r.keydata FROM retos_tecnologicos AS r WHERE r.id = retoAspirante.id_reto)`), 'keydata'],
          ], required: false
        },
        {
          model: CursosModel, as: 'curso', attributes: [
            'nombre',
            'keydata'
          ], required: false
        },
        {
          model: EventosModel, as: 'evento', attributes: [
            'nombre',
            'keydata'
          ], required: false
        },
        {
          model: PqrsModel, as: 'pqr', attributes: [
            ['pqr', 'nombre'],
          ], required: false
        },
        ],
        order: [['createdAt', 'Desc']],
      })
      const data = NotificacionesCTR.mapDataNotification(notifications);

      return res.status(200).json({ data, msg: 'success' });
    } catch (error) {
      console.log("🚀 ~ NotificacionesCTR ~ getNotifications ~ error:", error)
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

  async updateStateNotification(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const idNotificacion = req.params.idNotificacion;

        await NotificacionesModel.update({ estado: 1 }, { where: { id: idNotificacion } }, { transaction: t });

        return res.status(200).json({ data: true, msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async postNotificationComentario(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const user = await UsersModel.findByPk(token.id);

        const postData = {
          tipo: 24,
          comentario: body.comentario,
          idReto: body.idReto,
          idUser: body.idUser,
          userActivo: 1,
          createdBy: token.id,
          contactoNombre: user.nombre,
          contactoTelefono: user.telefono,
          contactoCorreo: user.email
        }
        await NotificacionesModel.create(postData, { transaction: t })

        return res.status(200).json({ data: true, msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  static mapDataNotification(notifications) {
    const data = [];

    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];

      const { id,
        idServicio,
        idReto,
        idRetoAspirante,
        contactoNombre,
        contactoCorreo,
        contactoTelefono,
        userActivo,
        comentario,
        notificacion,
        idPqr,
        createdAt,
        tipoLabel,
        idEvento,
        servicio,
        reto,
        retoAspirante,
        curso,
        evento,
        biblioteca,
        pqr,
      } = element;

      const item = servicio || reto || retoAspirante || curso || evento || biblioteca || pqr;
      data.push({
        idNotificacion: id,
        id: idServicio || idReto || idPqr || idEvento || idRetoAspirante,
        contactoNombre,
        contactoCorreo,
        contactoTelefono,
        userActivo,
        tipoLabel,
        notificacion,
        comentario,
        createdAt,
        nombre: item?.nombre || item?.dataValues?.nombre,
        keydata: item?.keydata || item?.dataValues?.keydata
      })
    }
    return data;
  }
}

module.exports = NotificacionesCTR;