const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const EventosModel = require('../models/Eventos');
const { Op, literal } = require('sequelize');
const { deleteFile, generateKeyWord, registerKeyData, validateKeyWord } = require('../helpers/helpers');
const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt')

class EventosCTR {
  async getEvents(req = request, res = response) {
    try {
      const { preview } = req.query
      const now = new Date();
      await EventosModel.update({ estado: 3 }, {
        where: { fechaInicio: { [Op.lt]: now } }
      })

      const events = await EventosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'logo',
          'fechaInicio',
          'urlRegistro',
          'precio',
          'estado',
          'keydata',
          'tipoResponsable',
          'createdBy',
          'estadoLabel',
          'urlLogo',
          [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = eventos.id_ciudad)'), 'ciudad'],
          [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = eventos.id_ciudad)'), 'departamento'],
          [literal(`COALESCE((SELECT nombre FROM entidades AS e WHERE e.id_user_responsable = createdBy), (SELECT nombre FROM users AS u WHERE u.id = createdBy))`), 'nombreResponsable']
        ],
        where: { estado: { [Op.in]: [1, 2] } },
        order: [['fechaInicio', 'ASC']],
        limit: preview ? 4 : null
      })
      return res.status(200).json({ msg: 'success', data: events });
    } catch (error) {
      return res.status(400).json({ data: error });
    }
  }

  async getEventsDashboard(req, res) {
    try {
      const now = new Date();
      const { page } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;

      await EventosModel.update({ estado: 3 }, {
        where: { fechaInicio: { [Op.lt]: now } }
      })

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
          'tipoResponsable',
          'estado',
          'estadoLabel',
          'createdBy',
          'urlLogo',
          [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = eventos.id_ciudad)'), 'ciudad'],
          [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = eventos.id_ciudad)'), 'departamento'],
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
          tipoResponsable: contact.tipo,
          keydata: await bcrypt.hash(keydata, 10),
          logo: file ? file?.filename : null,
          createdBy: contact.id,
          fechaInicio: new Date(fechaInicio)
        }, { transaction: t })

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

        body.updatedBy = token.id
        const model = await EventosModel.update(body, {
          where: { id },
        }, { transaction: t })

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
        const { keydata } = req.query

        const validateKeyData = await validateKeyWord(id, 'EV', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún evento', status: 400 });

        const event = await EventosModel.findByPk(id);
        const fileToDelete = event?.logo;

        await event.destroy({ transaction: t });

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

}

module.exports = EventosCTR;