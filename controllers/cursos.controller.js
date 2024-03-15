const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const { urlFiles } = require('../config/config');
const CursosModel = require('../models/Cursos');
const bcrypt = require('bcrypt');
const { registerKeyData, validateKeyWord, deleteFile, generateKeyWord } = require('../helpers/helpers');
const NotificacionesModel = require('../models/Notificaciones');
const EntidadesModel = require('../models/Entidades');

class CursosCTR {
  async getCourses(req, res) {
    try {
      const { token, query } = req;
      const { nombre, idsCategorias } = query;
      const ids = idsCategorias?.split(',');

      const courses = await CursosModel.findAll({
        attributes: [
          'id',
          'estado',
          'nombre',
          'imagen',
          'urlImagen',
          'keydata',
          'descripcion',
          'idUserResponsable',
          'idTipoCategoria',
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = idTipoCategoria)`), 'categoria'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'nombreEntidad'],
          [literal(`(SELECT e.telefono FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'telefonoEntidad'],
          [literal(`(SELECT e.email FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'emailEntidad'],
        ],
        where: {
          ...(token && token.superadmin ? {} : { estado: 1 }),
          ...(token && !token.superadmin ? { idUserResponsable: token.id } : {}),
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(idsCategorias ? { idTipoCategoria: { [Op.in]: ids } } : {}),
        },
        order: [['createdAt', 'Desc']],
      })

      return res.status(200).json({ data: courses, msg: 'success' });
    } catch (error) {
      throw error;
    }
  }

  async getDetailCourse(req, res) {
    try {
      const id = req.params.idCurso;

      const course = await CursosModel.findOne({
        attributes: [
          'id',
          'estado',
          'nombre',
          'imagen',
          'urlImagen',
          'keydata',
          'descripcion',
          'idUserResponsable',
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'nombreEntidad'],
          [literal(`(SELECT e.telefono FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'telefonoEntidad'],
          [literal(`(SELECT e.email FROM entidades AS e WHERE id_user_responsable = idUserResponsable)`), 'emailEntidad'],
        ],
        where: {
          id
        }
      })

      return res.status(200).json({ data: course, msg: 'success' });
    } catch (error) {
      throw error;
    }
  }

  async postulateCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, files, token } = req;
        const { nombre, descripcion } = body
        const imagen = files['imagen'][0];
        const fichaTecnica = files['fichaTecnica'][0];

        const entidad = await EntidadesModel.findOne({ where: { idUserResponsable: token.id } });
        if (!entidad) return res.status(400).json({ type: 'error', msg: 'Por favor cree una entidad unipersonal para crear cursos', status: 400 });

        const keydata = await generateKeyWord();
        const model = await CursosModel.create({
          nombre,
          descripcion,
          idTipoCategoria: body.idCategoria,
          keydata: await bcrypt.hash(keydata, 10),
          imagen: imagen ? imagen?.filename : null,
          fichaTecnica: fichaTecnica ? fichaTecnica.filename : null,
          idUserResponsable: token.id,
          estado: token.superadmin ? 1 : 2,
          createdBy: token.id
        }, { transaction: t })

        await registerKeyData(model.id, body.nombre, keydata, 'CU');

        const notificationData = {
          tipo: 33,
          idCurso: model.id,
          userActivo: 1,
          createdBy: token.id
        }
        await NotificacionesModel.create(notificationData, { transaction: t });

        return res.status(200).json({ data: model, msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async aprobeCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idCurso;
        const { body, token } = req;

        const validateKeyData = await validateKeyWord(id, 'CU', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún curso', status: 400 });

        const model = await CursosModel.findByPk(id);
        await model.update({ estado: 1 }, { transaction: t });
        const notificationData = {
          tipo: 32,
          idCurso: id,
          idUser: model.idUserResponsable,
          userActivo: 1,
          createdBy: token.id
        }
        await NotificacionesModel.create(notificationData, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateFieldCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params, token, body } = req;
        const { keydata, campo, value } = body;

        const model = await CursosModel.findByPk(params.idCurso);
        if (body.campo == 'estado' && model.estado == 2 && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'El administrador debe aceptar el curso para que le puedas editar el estado', status: 400 });
        if (model.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el curso', status: 400 });
        const validateKeyData = await validateKeyWord(params.idCurso, 'CU', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún curso registrado', status: 400 });

        const updateData = {
          [campo]: value,
          updatedBy: token.id
        }

        await model.update(updateData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });

      })
    } catch (error) {
      throw error;
    }
  }

  async updateFilesCourse(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params, token, body, file } = req;
        const { keydata, campo } = body;
        const id = params.idCurso

        const validateKeyData = await validateKeyWord(id, 'CU', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún curso', status: 400 });
        const model = await CursosModel.findByPk(id);
        if (model.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el curso', status: 400 });

        const fileToDelete = model[body.campo]
        const updateData = {
          [campo]: file?.filename,
          updatedBy: token.id
        }
        await model.update(updateData, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }


}

module.exports = CursosCTR;