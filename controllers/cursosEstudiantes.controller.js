const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { urlFiles } = require('../config/config');
const CursosModel = require('../models/Cursos');
const CursosEstudiantesModel = require('../models/CursosEstudiantes');

class CursosEstudiantesCTR {

  async acquireCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body } = req

        const course = await CursosModel.findOne(body.idCurso);
        if (!course || !course.estado) return res.status(400).json({ type: 'error', msg: 'El curso no está disponible', status: 400 });

        const postData = {
          idCurso,
          estado: 1,
          idUser: token.id,
          createdBy: token.id
        }
        await CursosEstudiantesModel.create(postData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateStateSubscripcion(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, params } = req;

        const model = await CursosEstudiantesModel.findByPk(params.idEstudianteCurso);
        const updateData = {
          estado: file.estado ? 0 : 1,
          updatedBy: token.id
        }
        await model.update(updateData, { transaction: t })

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

}

module.exports = CursosEstudiantesCTR;