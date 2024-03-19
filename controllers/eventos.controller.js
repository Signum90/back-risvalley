const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const EventosModel = require('../models/Eventos');
const { Op, literal } = require('sequelize');
const { deleteFile, generateKeyWord, registerKeyData, validateKeyWord, deleteKeyWord } = require('../helpers/helpers');
const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const NotificacionesModel = require('../models/Notificaciones');

class EventosCTR {
  async getEvents(req = request, res = response) {
    try {
      const { preview } = req.query
      const now = new Date();

      const events = await EventosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'logo',
          'fechaInicio',
          'urlRegistro',
          'precio',
          'idCiudad',
          'estado',
          'keydata',
          'tipoResponsable',
          'createdBy',
          'estadoLabel',
          'urlLogo',
          [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = idCiudad)'), 'ciudad'],
          [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'departamento'],
          [literal('(SELECT d.id FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'idDepartamento'],
          [literal(`COALESCE((SELECT nombre FROM entidades AS e WHERE e.id_user_responsable = createdBy), (SELECT nombre FROM users AS u WHERE u.id = createdBy))`), 'nombreResponsable']
        ],
        where: {
          estado: 1,
          fechaInicio: { [Op.gte]: now }
        },
        order: [['fechaInicio', 'ASC']],
        limit: preview ? 4 : null
      })
      return res.status(200).json({ msg: 'success', data: events });
    } catch (error) {
      return res.status(400).json({ data: error });
    }
  }

  async getDetailEvent(req, res) {
    try {
      const id = req.params.idEvento;

      const event = await EventosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'logo',
          'fechaInicio',
          'urlRegistro',
          'precio',
          'idCiudad',
          'estado',
          'keydata',
          'tipoResponsable',
          'createdBy',
          'estadoLabel',
          'urlLogo',
          [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = idCiudad)'), 'ciudad'],
          [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'departamento'],
          [literal('(SELECT d.id FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'idDepartamento'],
          [literal(`COALESCE((SELECT nombre FROM entidades AS e WHERE e.id_user_responsable = createdBy), (SELECT nombre FROM users AS u WHERE u.id = createdBy))`), 'nombreResponsable']
        ],
        where: { id },
      })

      return res.status(200).json({ msg: 'success', data: event });
    } catch (error) {
      throw error;
    }
  }

  async getEventsDashboard(req, res) {
    try {
      const { page } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;

      const events = await EventosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'logo',
          'fechaInicio',
          'keydata',
          'urlRegistro',
          'precio',
          'idCiudad',
          'tipoResponsable',
          'estado',
          'estadoLabel',
          'createdBy',
          'urlLogo',
          [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = idCiudad)'), 'ciudad'],
          [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'departamento'],
          [literal('(SELECT d.id FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = idCiudad)'), 'idDepartamento'],
          [literal(`COALESCE((SELECT nombre FROM entidades AS e WHERE e.id_user_responsable = createdBy), (SELECT nombre FROM users AS u WHERE u.id = createdBy))`), 'nombreResponsable']
        ],
        order: [['estado', 'ASC']],
        offset: (paginate - 1) * pageSize,
        limit: pageSize
      })
      const total = await EventosModel.count();

      return res.status(200).json({ msg: 'success', data: events, total });
    } catch (error) {
      return res.status(400).json({ data: error });
    }
  }

  async saveEvent(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {

        const { nombre, descripcion, fechaInicio, urlRegistro, precio, idCiudad, idUserResponsable } = req.body;
        const { file, token } = req
        const idContact = token.superadmin && idUserResponsable ? idUserResponsable : token.id;
        const contact = await UsersModel.findByPk(idContact);
        const keydata = await generateKeyWord();

        const model = await EventosModel.create({
          nombre, descripcion, urlRegistro, precio, idCiudad,
          estado: token.superadmin ? 1 : 2,
          tipoResponsable: contact.tipo,
          keydata: await bcrypt.hash(keydata, 10),
          logo: file ? file?.filename : null,
          createdBy: contact.id,
          fechaInicio: new Date(fechaInicio)
        }, { transaction: t })

        if (!token.superadmin) {
          const notificationData = {
            tipo: 51,
            idEvento: model.id,
            userActivo: 1,
            createdBy: token.id,
            contactoNombre: contact.nombre,
            contactoCorreo: contact.email,
            contactoTelefono: contact.telefono
          }
          await NotificacionesModel.create(notificationData, { transaction: t });
        }


        await registerKeyData(model.id, nombre, keydata, 'EV');
        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  async updateLogoEvent(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body } = req
        const id = req.params.idEvento

        const validateKeyData = await validateKeyWord(id, 'EV', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });

        const event = await EventosModel.findByPk(id);
        if (event.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el evento', status: 400 });

        const fileToDelete = event?.logo;
        await event.update({
          logo: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', event });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateLogoEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async updateEvent(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idEvento
        const { body, token } = req

        const validateKeyData = await validateKeyWord(id, 'EV', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });
        const model = await EventosModel.findByPk(id);
        if (model.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el evento', status: 400 });

        body.updatedBy = token.id
        await model.update(body, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async updateEventField(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idEvento
        const { body, token } = req

        const validateKeyData = await validateKeyWord(id, 'EV', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });
        const model = await EventosModel.findByPk(id);
        if (body.campo == 'estado' && model.estado == 2 && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'El administrador debe aprobar el evento para que puedas modificar el estado', status: 400 });
        if (model.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el evento', status: 400 });

        const editData = {
          [body.campo]: body.value
        }
        await model.update(editData, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }


  async deleteEvent(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idEvento
        const token = req.token
        const { keydata } = req.query

        const validateKeyData = await validateKeyWord(id, 'EV', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });

        const event = await EventosModel.findByPk(id);
        if (event.createdBy != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar el evento', status: 400 });
        const fileToDelete = event?.logo;

        await event.destroy({ transaction: t });
        await deleteKeyWord(validateKeyData.id);
        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async aprobeEvent(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idEvento;
        const { body, token } = req;
        const validateKeyData = await validateKeyWord(id, 'EV', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });
        const model = await EventosModel.findByPk(id);
        await model.update({ estado: 1, updatedBy: token.id }, { transaction: t });

        const notificationData = {
          tipo: 52,
          idUser: model.createdBy,
          idEvento: model.id,
          userActivo: 1,
          createdBy: token.id,
        }
        await NotificacionesModel.create(notificationData, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

}

module.exports = EventosCTR;