const { sequelize } = require('../db/connection');
const CursosModel = require('../models/Cursos');
const CursosEstudiantesModel = require('../models/CursosEstudiantes');

class CursosEstudiantesCTR {

  async acquireCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body } = req
        const course = await CursosModel.findByPk(body.idCurso);
        if (!course || !course.estado) return res.status(400).json({ type: 'error', msg: 'El curso no está disponible', status: 400 });
        if (course.precio > 0) {
          //Acá va la logica si en el futuro se ingresa pasarela de pagos para cobrar el curso
        }
        const postData = {
          idCurso: body.idCurso,
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
        console.log("🚀 ~ CursosEstudiantesCTR ~ returnawaitsequelize.transaction ~ token:", token)

        const model = await CursosEstudiantesModel.findByPk(params.idCursoEstudiante);
        const curso = await CursosModel.findByPk(model.idCurso);
        if (curso.idUserResponsable != token.id && !token.superadmin && token.id != params.idCursoEstudiante) {
          return res.status(400).json({ type: 'error', msg: 'No tienes permiso editar el estado del estudiante', status: 400 });
        }

        const updateData = {
          estado: model.estado ? 0 : 1,
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