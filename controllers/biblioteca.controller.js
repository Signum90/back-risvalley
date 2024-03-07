const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { urlFiles } = require('../config/config');
const BibliotecaModel = require('../models/Biblioteca');
const { saveResourceMultimedia, deleteResourceMultimedia, deleteFile } = require('../helpers/helpers');

class BibliotecaController {
  async getFilesLibrary(req, res) {
    try {
      const { token } = req
      const { page } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;

      const files = await BibliotecaModel.findAll({
        attributes: [
          'id',
          'estado',
          [literal(`(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'tipo'],
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
        ],
        where: {
          ...(token ? {} : { estado: 1 }),
        },
        order: [['createdAt', 'Desc']],
        offset: (paginate - 1) * pageSize,
        limit: pageSize
      })

      return res.status(200).json({ data: files });

    } catch (error) {
      throw error;
    }
  }

  async postFileLibrary(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token } = req

        const recursoMultimediaRegistro = await saveResourceMultimedia(file, token?.id);

        const model = await BibliotecaModel.create({
          idRecursoMultimedia: recursoMultimediaRegistro.id,
          estado: 1,
          createdBy: token.id
        }, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async changeStateFile(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, params } = req;
        const file = await BibliotecaModel.findByPk(params.idArchivo);

        const updateData = {
          estado: file.estado ? 0 : 1,
          updatedBy: token.id
        }

        await file.update(updateData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: file });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFileLibrary(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params } = req;

        const file = await BibliotecaModel.findByPk(params.idArchivo);
        const multimediaFile = await deleteResourceMultimedia(file.idRecursoMultimedia);

        deleteFile(multimediaFile, (err) => {
          if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
        });

        await file.destroy({ transaction: t });
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BibliotecaController;