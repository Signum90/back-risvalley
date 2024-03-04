const RetosAspirantesModel = require('../models/RetosAspirantes');
const { sequelize } = require('../db/connection');
const { col } = require('sequelize');
const { deleteFile } = require('../helpers/helpers');
const UsersModel = require('../models/Users');

class RetosAspirantesCTR {
  async getCandidatesChallenge(req, res) {
    try {
      const candidates = await RetosAspirantesModel.findAll({
        attributes: [
          'id', 'idUserAspirante', 'idReto', 'urlFichaTecnica', 'fichaTecnica',
          [col('aspirante.nombre'), 'nombreAspirante'],
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
}

//■► EXPORTAR:  ◄■:
module.exports = RetosAspirantesCTR;