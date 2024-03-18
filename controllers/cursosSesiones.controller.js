const { sequelize } = require('../db/connection');
const { Op } = require('sequelize');
const CursosModel = require('../models/Cursos');
const CursosSesionesModel = require('../models/CursosSesiones');
const CursosClasesModel = require('../models/CursosClases');

class CursosSesionesCTR {
  async getSessionsCourse(req, res) {
    try {
      const { token, params } = req;

      const curso = await CursosModel.findByPk(params.idCurso);
      const estados = token?.superadmin || curso.idUserResponsable == token?.id ? [1, 0] : [1];
      console.log("🚀 ~ CursosSesionesCTR ~ getSessionsCourse ~ estados:", estados)

      const sessions = await CursosSesionesModel.findAll({
        attributes: ['id', 'descripcion', 'estado', 'nombre'],
        where: {
          idCurso: params.idCurso,
          estado: {
            [Op.in]: estados
          }
        },
        order: [['createdAt', 'Desc']],
      },)

      return res.status(200).json({ msg: 'success', data: sessions });
    } catch (error) {
      throw error;
    }
  }

  async postSessionCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body } = req;
        const curso = CursosModel.findByPk(body.idCurso);
        if (curso.estado == 2) return res.status(400).json({ type: 'error', msg: 'No puedes crear sesiones hasta que un admin apruebe el curso', status: 400 });
        if (curso.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para crear sesiones en este curso', status: 400 });

        const postData = {
          nombre: body.nombre,
          idCurso: body.idCurso,
          createdBy: token.id
        }
        const model = await CursosSesionesModel.create(postData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteSessionCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, params } = req;

        const model = await CursosSesionesModel.findByPk(params.idSesion)
        const curso = CursosModel.findByPk(model.idCurso);
        if (curso.idUserResponsable != token.id && !token.superadmin) {
          return res.status(400).json({ type: 'error', msg: 'No tienes permiso para eliminar esta sesión', status: 400 });
        }

        const sessions = CursosClasesModel.findOne({ where: { idCursoSesion: params.idSesion } });
        if (sessions) return res.status(400).json({ type: 'error', msg: 'No puedes eliminar la sesión porque tiene clases creadas', status: 400 });

        await model.destroy({ transaction: t });
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateSessionCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body, params } = req;
        const { campo, value } = body

        const model = await CursosSesionesModel.findByPk(params.idSesion)
        if (model.idUserResponsable != token.id && !token.superadmin) {
          return res.status(400).json({ type: 'error', msg: 'No tienes permiso para editar esta sesión', status: 400 });
        }
        const updateData = {
          [campo]: value,
          updatedBy: token.id
        }
        await model.update(updateData, { transaction: t })

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error
    }
  }
}

module.exports = CursosSesionesCTR;
