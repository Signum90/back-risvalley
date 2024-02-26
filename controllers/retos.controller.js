const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const { sequelize } = require('../db/connection');
const { literal, Op, where } = require('sequelize');
const { deleteFile, saveResourceMultimedia, deleteResourceMultimedia } = require('../helpers/helpers');
const { urlFiles } = require('../config/config');
const UsersModel = require('../models/Users');
const EntidadesModel = require('../models/Entidades');

class RetosCTR {
  async getTechnologicalChallenges(req, res) {
    try {
      await RetosCTR.updateStatesTechnologicalChallenge();
      const challenges = await RetosTecnologicosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado',
          'estadoLabel',
          'fechaInicioConvocatoria',
          'fechaFinConvocatoria',
          'fichaTecnica',
          'idUserEntidad',
          'urlFichaTecnica',
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
          [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipoRecursoMultimedia'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = idUserEntidad)`), 'nombreEntidad'],
        ],
        where: {
          estado: {
            [Op.in]: [1, 2]
          }
        },
        order: [['fechaInicioConvocatoria', 'DESC']]
      })
      return res.status(200).json({ msg: 'success', data: challenges });
    } catch (error) {
      throw error;
    }
  }

  async getAllTechnologicalChallenges(req, res) {
    try {
      const { page } = req.query
      const paginate = page ?? 1;

      await RetosCTR.updateStatesTechnologicalChallenge();
      const challenges = await RetosTecnologicosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado',
          'estadoLabel',
          'fechaInicioConvocatoria',
          'fechaFinConvocatoria',
          'fichaTecnica',
          'idUserEntidad',
          'urlFichaTecnica',
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
          [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipoRecursoMultimedia'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = idUserEntidad)`), 'nombreEntidad'],
        ],
        order: [['fechaInicioConvocatoria', 'DESC']],
        offset: (paginate - 1) * 5,
        limit: 5
      })
      const total = await RetosTecnologicosModel.count();

      return res.status(200).json({ msg: 'success', data: challenges, total });
    } catch (error) {
      throw error;
    }
  }

  static async updateStatesTechnologicalChallenge() {
    return await sequelize.transaction(async (t) => {
      const now = new Date();
      await RetosTecnologicosModel.update({ estado: 3 }, { where: { fechaFinConvocatoria: { [Op.lt]: now } } }, { transaction: t })
      await RetosTecnologicosModel.update({ estado: 2 }, {
        where: {
          fechaInicioConvocatoria: { [Op.lte]: now },
          fechaFinConvocatoria: { [Op.gte]: now }
        }
      }, { transaction: t })
    })
  }

  async saveTechnologicalChallenge(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token, files } = req;
        const { nombre, descripcion, fechaInicioConvocatoria, fechaFinConvocatoria } = body;
        const fichaTecnica = files['fichaTecnica'][0];
        const multimedia = files['recursoMultimedia'][0];
        if (!multimedia) return res.status(400).json({ type: 'error', msg: 'El recurso multimedia es requerido', status: 400 });
        const entidad = await EntidadesModel.findOne({ where: { idUserResponsable: token.id } });
        if (!entidad) return res.status(400).json({ type: 'error', msg: 'Por favor cree una entidad unipersonal para crear eventos', status: 400 });

        const recursoMultimediaRegistro = await saveResourceMultimedia(multimedia, token?.id);
        const model = await RetosTecnologicosModel.create({
          nombre,
          descripcion,
          fechaInicioConvocatoria,
          fechaFinConvocatoria,
          idRecursoMultimedia: recursoMultimediaRegistro?.id,
          fichaTecnica: fichaTecnica ? fichaTecnica?.filename : null,
          idUserEntidad: token.id,
          createdBy: token.id,
        }, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (e) {
      throw e;
    }
  }

  async saveTechnologicalChallengeFromDashboard(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token, files } = req;
        const { nombre, descripcion, fechaInicioConvocatoria, fechaFinConvocatoria, idUserEntidad } = body;
        const fichaTecnica = files['fichaTecnica'][0];
        const multimedia = files['recursoMultimedia'][0];
        if (!multimedia) return res.status(400).json({ type: 'error', msg: 'El recurso multimedia es requerido', status: 400 });
        const entidad = await EntidadesModel.findOne({ where: { idUserResponsable: idUserEntidad } });
        if (!entidad) return res.status(400).json({ type: 'error', msg: 'El usuario debe tener una entidad', status: 400 });

        const recursoMultimediaRegistro = await saveResourceMultimedia(multimedia, token?.id);
        const model = await RetosTecnologicosModel.create({
          nombre,
          descripcion,
          fechaInicioConvocatoria,
          fechaFinConvocatoria,
          idRecursoMultimedia: recursoMultimediaRegistro?.id,
          fichaTecnica: fichaTecnica ? fichaTecnica?.filename : null,
          idUserEntidad,
          createdBy: token.id,
        }, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (e) {
      throw e;
    }
  }

  async updateFilesChallenge(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token, file } = req;

        const reto = await RetosTecnologicosModel.findByPk(req.params.idReto);
        let fileToDelete;
        let updateData = { updatedBy: token.id };

        if (body.campo == 'fichaTecnica') {
          fileToDelete = reto[body.campo]
          updateData[body.campo] = file ? file?.filename : null
        } else if (body.campo == 'recursoMultimedia') {
          fileToDelete = await deleteResourceMultimedia(body.idRecursoMultimedia);
          const recursoMultimediaRegistro = await saveResourceMultimedia(file, token?.id);
          updateData[multimedia] = recursoMultimediaRegistro?.id
        }
        await reto.update(updateData, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: reto });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateFieldChallenge(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const { campo, value } = body;
        const id = req.params.idReto;

        if (campo == 'fechaFinConvocatoria') {
          const dateValidate = await RetosTecnologicosModel.findOne({
            where: {
              id,
              fechaInicioConvocatoria: { [Op.lt]: new Date(value) }
            }
          })
          if (!dateValidate) return res.status(400).json({ type: 'error', msg: 'La fecha de cierre de la convocatoria debe ser mayor a la de inicio', status: 400 });
        }
        const updateData = {
          [campo]: value,
          updatedBy: token.id
        }
        await RetosTecnologicosModel.update(updateData, { where: { id } }, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteReto(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idReto

        const reto = await RetosTecnologicosModel.findByPk(id);
        const fileToDelete = reto?.fichaTecnica;

        await reto.destroy({ transaction: t });
        const multimediaFile = await deleteResourceMultimedia(reto.idRecursoMultimedia)

        deleteFile(fileToDelete, (err) => {
          if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
        })
        deleteFile(multimediaFile, (err) => {
          if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
        })
        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw error
    }
  }
}

//■► EXPORTAR:  ◄■:
module.exports = RetosCTR;