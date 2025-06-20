const { sequelize } = require('../db/connection');
const { literal, col, Op } = require('sequelize');
const { deleteFile, generateKeyWord, registerKeyData, validateKeyWord } = require('../helpers/helpers');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const UsersModel = require('../models/Users');
const { urlFiles } = require('../config/config');
const bcrypt = require('bcrypt');
const NotificacionesModel = require('../models/Notificaciones');
const KeyWordsModel = require('../models/KeyWords');
const EntidadesModel = require('../models/Entidades');
class ServiciosTecnologicosCTR {
  async getTechnologicalService(req, res) {
    try {
      const { nombre, idTipoServicio, idTipoClienteServicio, page } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;
      const token = req?.token;
      const estados = token && token.superadmin ? [0, 1, 2] : [1];

      const services = await ServiciosTecnologicosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado',
          'estadoLabel',
          'imagen',
          'urlImagen',
          'idTipoServicio',
          'idTipoClienteServicio',
          'keydata',
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoServicio)'), 'tipoServicio'],
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoClienteServicio)'), 'tipoClienteServicio'],
          [col('contacto.nombre'), 'nombreContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.email'), 'correoContacto'],
          [literal(`(SELECT url_dominio FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlDominio'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'nombreEntidad'],
          [literal(`(SELECT e.email FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'emailEntidad'],
          [literal(`(SELECT e.telefono FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'telefonoEntidad'],
          [literal(`(SELECT CONCAT('${urlFiles}', e.logo) FROM entidades AS e WHERE e.id_user_responsable = contacto.id)`), 'urlLogo'],
        ],
        where: {
          estado: { [Op.in]: estados },
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(idTipoServicio ? { idTipoServicio } : {}),
          ...(idTipoClienteServicio ? { idTipoClienteServicio } : {}),
        },
        include: [{ model: UsersModel, as: 'contacto', attributes: [] }],
        offset: (paginate - 1) * pageSize,
        limit: pageSize
      })

      const total = await ServiciosTecnologicosModel.count({
        where: {
          estado: { [Op.in]: estados },
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(idTipoServicio ? { idTipoServicio } : {}),
          ...(idTipoClienteServicio ? { idTipoClienteServicio } : {}),
        },
      });

      return res.status(200).json({ msg: 'success', data: services, total });
    } catch (error) {
      throw error;
    }
  }

  async postTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;
        const keydata = await generateKeyWord();

        const entidad = await EntidadesModel.findOne({ where: { idUserResponsable: token.id } });
        if (!entidad) return res.status(400).json({ type: 'error', msg: 'Por favor cree una entidad unipersonal para crear cursos', status: 400 });

        const postData = {
          nombre: body.nombre,
          estado: 2,
          descripcion: body.descripcion,
          keydata: await bcrypt.hash(keydata, 10),
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          imagen: file ? file?.filename : null,
          createdBy: token.id
        };
        const model = await ServiciosTecnologicosModel.create(postData, { transaction: t });

        const user = await UsersModel.findByPk(token.id)
        const notificationData = {
          tipo: 13,
          idServicio: model.id,
          userActivo: 1,
          createdBy: token.id,
          contactoNombre: user.nombre,
          contactoCorreo: user.email,
          contactoTelefono: user.telefono
        }
        await registerKeyData(model.id, body.nombre, keydata, 'SE');
        await NotificacionesModel.create(notificationData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async postTechnologicalServiceFromDashboard(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;
        const keydata = await generateKeyWord();

        const postData = {
          nombre: body.nombre,
          descripcion: body.descripcion,
          keydata: await bcrypt.hash(keydata, 10),
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          imagen: file ? file?.filename : null,
          createdBy: body.idUserContacto
        };
        const model = await ServiciosTecnologicosModel.create(postData, { transaction: t });
        await registerKeyData(model.id, body.nombre, keydata, 'SE');

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const id = req.params.idServicio;

        const validateKeyData = await validateKeyWord(id, 'SE', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });

        const editData = {
          nombre: body.nombre,
          descripcion: body.descripcion,
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          updatedBy: token.id
        };
        const model = await ServiciosTecnologicosModel.findByPk(id);
        if (model.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el servicio', status: 400 });
        await model.update(editData, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw (error);
    }
  }

  async updateFieldsTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const { campo, value } = body
        const id = req.params.idServicio;

        const validateKeyData = await validateKeyWord(id, 'SE', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });

        const editData = {
          [campo]: value,
          updatedBy: token.id
        };
        const model = await ServiciosTecnologicosModel.findByPk(id);
        if (campo == 'estado' && model.estado == 2 && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'El administrador debe aprobar el servicio para que puedas editar el estado', status: 400 });
        if (model.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el servicio', status: 400 });
        await model.update(editData, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw (error);
    }
  }

  async aprobeTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const id = req.params.idServicio;
        const validateKeyData = await validateKeyWord(id, 'SE', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún servicio', status: 400 });
        const model = await ServiciosTecnologicosModel.findByPk(id);
        await model.update({ estado: 1 }, { transaction: t });

        const notificationData = {
          tipo: 12,
          idUser: model.createdBy,
          idServicio: id,
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

  async updateLogoService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body } = req;
        const id = req.params.idServicio;
        const validateKeyData = await validateKeyWord(id, 'SE', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún servicio', status: 400 });

        const service = await ServiciosTecnologicosModel.findByPk(id);
        if (service.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el servicio', status: 400 });
        const fileToDelete = service?.imagen;
        await service.update({
          imagen: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: service });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idServicio;
        const { keydata } = req.query;
        const token = req.token;

        const validateKeyData = await validateKeyWord(id, 'SE', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún servicio', status: 400 });

        const service = await ServiciosTecnologicosModel.findByPk(id);
        if (service.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para eliminar el servicio', status: 400 });
        const fileToDelete = service?.imagen;

        await KeyWordsModel.destroy({ where: { id: validateKeyData.id } }, { transaction: t })
        await service.destroy({ transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json(error)
    }
  }

  async getDetailService(req, res) {
    try {
      const id = req.params.idServicio;

      const service = await ServiciosTecnologicosModel.findOne({
        attributes: [
          'id',
          ['id', 'idServicio'],
          'nombre',
          'descripcion',
          'keydata',
          'estado',
          'idTipoServicio',
          'idTipoClienteServicio',
          'imagen',
          'urlImagen',
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoServicio)'), 'tipoServicio'],
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoClienteServicio)'), 'tipoClienteServicio'],
          [literal(`(SELECT url_dominio FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlDominio'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'nombreEntidad'],
          [literal(`(SELECT e.email FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'emailEntidad'],
          [literal(`(SELECT e.telefono FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'telefonoEntidad'],
          [col('contacto.nombre'), 'nombreContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.email'), 'correoContacto'],
          [literal(`(SELECT CONCAT('${urlFiles}', e.logo) FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlLogo'],
        ],
        where: { id },
        include: [{ model: UsersModel, as: 'contacto', attributes: [] }],
      })

      return res.status(200).json({ msg: 'success', data: service });
    } catch (error) {
      throw error;
    }
  }

  async getMyServices(req, res) {
    try {
      const token = req.token;

      const services = await ServiciosTecnologicosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado',
          'estadoLabel',
          'keydata',
          'idTipoServicio',
          'idTipoClienteServicio',
          'imagen',
          'urlImagen',
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoServicio)'), 'tipoServicio'],
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoClienteServicio)'), 'tipoClienteServicio'],
          [col('contacto.nombre'), 'nombreContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.email'), 'correoContacto'],
          [literal(`(SELECT url_dominio FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlDominio'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'nombreEntidad'],
          [literal(`(SELECT CONCAT('${urlFiles}', e.logo) FROM entidades AS e WHERE e.id_user_responsable = contacto.id)`), 'urlLogo'],
        ],
        where: {
          createdBy: token.id
        },
        include: [{ model: UsersModel, as: 'contacto', attributes: [] }],
      })

      return res.status(200).json({ msg: 'success', data: services });
    } catch (error) {
      throw error;
    }
  }

}

module.exports = ServiciosTecnologicosCTR;