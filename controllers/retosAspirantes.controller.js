const RetosAspirantesModel = require('../models/RetosAspirantes');
const { sequelize } = require('../db/connection');
const { col, literal } = require('sequelize');
const { deleteFile } = require('../helpers/helpers');
const UsersModel = require('../models/Users');
const NotificacionesModel = require('../models/Notificaciones');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const { urlFiles } = require('../config/config');

class RetosAspirantesCTR {
  async getCandidatesChallenge(req, res) {
    try {
      const candidates = await RetosAspirantesModel.findAll({
        attributes: [
          'id', 'idUserAspirante', 'idReto', 'urlFichaTecnica', 'fichaTecnica', 'createdAt',
          [col('aspirante.nombre'), 'nombreAspirante'],
          [col('aspirante.telefono'), 'telefonoAspirante'],
          [col('aspirante.email'), 'emailAspirante'],
        ],
        where: {
          idReto: req.params.idReto
        },
        include: [{ model: UsersModel, as: 'aspirante', attributes: [] }],
      })
      return res.status(200).json({ msg: 'success', data: candidates });
    } catch (e) {
      throw e;
    }
  }

  async saveCandidateChallenge(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token, file } = req;
        const model = await RetosAspirantesModel.create({
          idReto: body.idReto,
          idUserAspirante: token.id,
          fichaTecnica: file ? file?.filename : null,
          createdBy: token.id
        }, { transaction: t })

        const reto = await RetosTecnologicosModel.findByPk(body.idReto);
        const user = await UsersModel.findByPk(token.id)

        const notificationData = {
          tipo: 21,
          idRetoAspirante: model.id,
          idUser: reto.idUserEntidad,
          userActivo: 1,
          contactoNombre: user?.nombre,
          contactoCorreo: user?.email,
          contactoTelefono: user?.telefono,
          createdBy: token.id
        }
        await NotificacionesModel.create(notificationData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (e) {
      throw e;
    }
  }

  async removeCandidateChallenge(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idRetoAspirante;
        const token = req.token

        const model = await RetosAspirantesModel.findByPk(id);
        if (model.idUserAspirante != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para eliminar la solicitud', status: 400 });
        const fileToDelete = model?.fichaTecnica;
        await model.destroy({ transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success' });
      })
    } catch (e) {
      throw e
    }
  }

  async chooseAplicant(req, res) {
    try {
      const { token, params } = req;

      const idPostulation = params.idRetoAspirante;
      const model = await RetosAspirantesModel.findByPk(idPostulation);
      const challenge = await RetosTecnologicosModel.findOne({
        where: { id: model.idReto }
      })
      const user = await UsersModel.findByPk(challenge.idUserEntidad)
      if (challenge.idUserEntidad != token.id) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para elegir aspirantes en este reto', status: 400 });

      await sequelize.transaction(async (t) => {
        await RetosAspirantesModel.update({ aspiranteElegido: 0 }, {
          where: { idReto: challenge.id }
        }, { transaction: t })
      })

      await sequelize.transaction(async (t) => {
        await model.update({ aspiranteElegido: 1 }, { transaction: t });
      })

      const notificationData = {
        tipo: 25,
        idReto: challenge.id,
        userActivo: 1,
        idUser: model.idUserAspirante,
        createdBy: token.id,
        contactoNombre: user.nombre,
        contactoCorreo: user.email,
        contactoTelefono: user.telefono
      }
      await sequelize.transaction(async (t) => {
        await NotificacionesModel.create(notificationData, { transaction: t });
      })

      return res.status(200).json({ msg: 'success', data: true });
    } catch (error) {
      throw error;
    }
  }

  async getMyCandidacy(req, res) {
    try {
      const { token } = req;

      const challenges = await RetosTecnologicosModel.findAll({
        attributes: [
          'id',
          ['id', 'idReto'],
          'nombre',
          'descripcion',
          'estado',
          'keydata',
          'estadoLabel',
          'fechaInicioConvocatoria',
          'fechaFinConvocatoria',
          'fichaTecnica',
          'idUserEntidad',
          'urlFichaTecnica',
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
          [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipoRecursoMultimedia'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = idUserEntidad)`), 'nombreEntidad'],
          [literal(`(SELECT 1 FROM retos_aspirantes AS ra WHERE ra.id_reto = idReto AND ra.id_user_aspirante = ${token.id})`), 'postulacion']
        ],
        where: {
          estado: 1
        },
        raw: true
      })

      const data = challenges.filter((e) => e.postulacion == 1)

      return res.status(200).json({ msg: 'success', data });
    } catch (error) {
      throw error;
    }
  }
}

//■► EXPORTAR:  ◄■:
module.exports = RetosAspirantesCTR;