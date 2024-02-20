const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { Op, literal } = require('sequelize');

class PqrsCTR {
  async getPQRS() {
    const pqrs = await PqrsCTR.findAll({
      attributes: [
        'id',
        'pqr',
        //[literal()]
      ]
    })

    return res.status(200).json({ msg: 'success', data: pqrs });
  }
}

module.exports = PqrsCTR;