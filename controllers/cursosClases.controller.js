const { sequelize } = require('../db/connection');
const { Op, literal } = require('sequelize');
const CursosClasesModel = require('../models/CursosClases');
const CursosModel = require('../models/Cursos');
const CursosSesionesModel = require('../models/CursosSesiones');
const { deleteFile } = require('../helpers/helpers');

class CursosClasesCTR {
  async getClassDetail(req, res) {
    try {
      const id = req.params.idClase

      const classDetail = await CursosClasesModel.findOne({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'clase',
          'urlClase',
          'estado'
        ],
        where: { id }
      })

      return res.status(200).json({ msg: 'success', data: classDetail });
    } catch (error) {
      throw error;
    }
  }

  async postClassCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body, file } = req;
        const permission = await CursosClasesCTR.validateCoursePropiety(body.idCursoSesion, token);
        if (!permission) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para crear clases en este curso', status: 400 });

        const postData = {
          clase: file?.filename,
          nombre: body.nombre,
          descripcion: body.descripcion,
          createdBy: token.id,
          idCursoSesion: body.idCursoSesion
        }

        const model = await CursosClasesModel.create(postData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async putFieldClassCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body } = req;
        const { campo, value } = body;

        const permission = await CursosClasesCTR.validateCoursePropiety(body.idCursoSesion, token);
        if (!permission) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para editar esta clase', status: 400 });
        const postData = {
          [campo]: value,
          updatedBy: token.id
        }

        await CursosClasesModel.update(postData, { transaction: t });
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async putFileClassCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body, params } = req;

        const permission = await CursosClasesCTR.validateCoursePropiety(body.idCursoSesion, token);
        if (!permission) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para editar esta clase', status: 400 });

        const classCourse = await CursosClasesModel.findByPk(params.idClase);
        const fileToDelete = classCourse?.clase;

        await classCourse.update({
          clase: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ CursosClasesCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteClassCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, params } = req;

        const permission = await CursosClasesCTR.validateCoursePropiety(params.idCursoSesion, token);
        if (!permission) return res.status(400).json({ type: 'error', msg: 'No tienes permiso para eliminar esta clase', status: 400 });

        const model = await CursosClasesModel.findByPk(params.idCursoSesion);
        const fileToDelete = classCourse?.clase;
        await model.delete({ transaction: t })
        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ CursosClasesCTR ~ deleteFile ~ err:", err)
          })
        }

      })
    } catch (error) {
      throw error;
    }
  }

  static async validateCoursePropiety(idCursoSesion, token) {
    try {
      const curso = await CursosModel.findOne({
        include: [{
          model: CursosSesionesModel,
          as: 'sesiones',
          required: true,
          where: { id: idCursoSesion }
        }]
      });
      if (curso.idUserResponsable != token.id && !token.superadmin) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CursosClasesCTR;