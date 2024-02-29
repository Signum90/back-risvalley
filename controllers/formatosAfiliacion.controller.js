const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const FormatosAfiliacionModel = require('../models/FormatosAfiliacion');
const { saveResourceMultimedia, deleteResourceMultimedia, deleteFile } = require('../helpers/helpers');
const { urlFiles } = require('../config/config');

class FormatosAfilicacionCTR {
  async postFormat(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body } = req;
        const recursoMultimediaRegistro = await saveResourceMultimedia(file, token?.id);
        await FormatosAfilicacionCTR.inactiveAllFormats();

        const model = await FormatosAfiliacionModel.create({
          idRecursoMultimedia: recursoMultimediaRegistro.id,
          estado: 1,
          fechaInicioFormato: body.fechaInicioFormato,
          fechaFinFormato: body.fechaFinFormato,
          createdBy: token.id
        }, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async getFormatActive(req, res) {
    try {
      const format = await FormatosAfiliacionModel.findOne({
        attributes: [
          'id',
          [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipo'],
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
        ],
        where: { estado: 1 },
        order: [['createdAt', 'Desc']],
      });

      return res.status(200).json({ msg: 'success', data: format });
    } catch (error) {
      throw error;
    }
  }

  static async inactiveAllFormats() {
    try {
      return await sequelize.transaction(async (t) => {
        await FormatosAfiliacionModel.update({ estado: 0 }, { where: {} }, { transaction: t })
      })
    } catch (error) {
      throw error;
    }
  }

  async activateFormat(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body } = req;
        const id = req.params.idFormato

        await FormatosAfilicacionCTR.inactiveAllFormats();
        await FormatosAfiliacionModel.update({
          estado: 1,
          updatedBy: token.id
        }, { where: { id } }, { transaction: t });

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFormat(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const idFormat = req.params.idFormato

        const format = await FormatosAfiliacionModel.findByPk(idFormat);
        if (format.estado == 1) return res.status(400).json({ type: 'error', msg: 'Active otro formato antes de eliminar este', status: 400 });
        const multimediaFile = await deleteResourceMultimedia(format.idRecursoMultimedia);

        deleteFile(multimediaFile, (err) => {
          if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
        });

        await format.destroy({ transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async getAllFormats(req, res) {
    try {
      const formats = await FormatosAfiliacionModel.findAll({
        attributes: [
          'id',
          'estado',
          [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipo'],
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
        ],
        order: [['estado', 'Desc']],
      })

      return res.status(200).json({ msg: 'success', data: formats });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FormatosAfilicacionCTR;