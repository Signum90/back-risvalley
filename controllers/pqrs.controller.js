const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const PqrsModel = require('../models/Pqrs');

class PqrsCTR {
  async getPQRS(req, res) {
    const pqrs = await PqrsModel.findAll({
      attributes: [
        'id',
        'pqr',
        'created_by',
        [literal('(SELECT u.nombre FROM users AS u WHERE u.id = pqrs.created_by)'), 'userNombre']
      ]
    })

    return res.status(200).json({ msg: 'success', data: pqrs });
  }

  async postPQRS(req, res) {
    return await sequelize.transaction(async (t) => {
      const { body, token } = req;

      const postData = {
        tipo: body.tipo,
        pqr: body.pqr,
        createdBy: token.id
      }

      const model = await PqrsModel.create(postData, { transaction: t })
      return res.status(200).json({ msg: 'success', data: model });
    })
  }
}

module.exports = PqrsCTR;