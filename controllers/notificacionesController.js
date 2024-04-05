const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const UsersModel = require('../models/Users');
const NotificacionesModel = require('../models/Notificaciones');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const { saveNotification } = require('../helpers/helpers');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const EventosModel = require('../models/Eventos');
const CursosModel = require('../models/Cursos');
const PqrsModel = require('../models/Pqrs');

class NotificacionesCTR {
  async getNotifications(req, res) {
    try {
      const { token } = req;
      return [123];

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
          'tipoLabel',
          //[literal(`COALESCE(
          //  (SELECT s.nombre FROM servicios_tecnologicos AS s WHERE s.id = notificaciones.id_servicio),
          //  (SELECT r.nombre FROM retos_tecnologicos AS r WHERE r.id = notificaciones.id_reto),
          //  (SELECT r.nombre FROM retos_aspirantes AS ra INNER JOIN retos_tecnologicos AS r ON r.id = ra.id_reto WHERE ra.id = idRetoAspirante),
          //  (SELECT c.nombre FROM cursos AS c WHERE c.id = idCurso),
          //  (SELECT e.nombre FROM eventos AS e WHERE e.id = idEvento)
          //)`), 'nombre']
        ],
        where: {
          ...(token.superadmin ? { idUser: null } : { idUser: token.id }),
          //...(token.superadmin ? {} : { estado: 0 }),
          estado: 0
        },
        order: [['createdAt', 'Desc']],
      })
      const data = [];

      for (let index = 0; index < notifications.length; index++) {
        const element = notifications[index];

        const { id,
          idServicio,
          idUser,
          idReto,
          idRetoAspirante,
          contactoNombre,
          contactoCorreo,
          contactoTelefono,
          userActivo,
          tipo,
          comentario,
          notificacion,
          idPqr,
          createdAt,
          tipoLabel,
          idEvento,
        } = element;

        let keydata;
        if (token.superadmin) {
          const idRegister = idServicio || idReto || idPqr || idEvento;
          keydata = await NotificacionesCTR.getKeydata(tipoLabel, idRegister);
        }
        data.push({
          idNotificacion: id,
          keydata,
          id: idServicio || idReto || idPqr || idEvento,
          contactoNombre,
          contactoCorreo,
          contactoTelefono,
          userActivo,
          tipoLabel,
          notificacion,
          comentario,
          createdAt,
          nombre: element?.dataValues?.nombre,
        })
      }
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

  static async getKeydata(model, id) {
    try {
      const models = {
        'Servicio': ServiciosTecnologicosModel,
        'Reto': RetosTecnologicosModel,
        'Evento': EventosModel,
        'Curso': CursosModel,
        'Pqrs': PqrsModel
      }

      const registro = await models[model].findByPk(id);

      return registro?.keydata ?? null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificacionesCTR;