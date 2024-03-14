const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { urlFiles } = require('../config/config');
const CursosModel = require('../models/Cursos');
const bcrypt = require('bcrypt');
const CursosSesionesModel = require('../models/CursosSesiones');

class CursosSesionesCTR {
  async getSessionsCourse(req, res) {
    try {
      const { token, params } = req;

      const sessions = await CursosSesionesModel.findAll({
        attributes: ['id', 'descripcion']
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CursosSesionesCTR;
