// ###################################################
// ######### CONTROLADOR: ENTIDADES ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const EntidadesModel = require('../models/Entidades');
const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { deleteFile, validateFieldUnique, validateKeyWord, generateKeyWord, registerKeyData } = require('../helpers/helpers');
const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const KeyWordsModel = require('../models/KeyWords');

class EntidadesCTR {
  async getEntidades(req = request, res = response) {
    try {
      const entidades = await EntidadesModel.findAll({
        attributes: [
          'id',
          'nombre',
          'logo',
          'descripcion',
          'sigla',
          'tipo',
          'tipoEntidad',
          'email',
          'telefono',
          'contactoNombre',
          'contactoCorreo',
          'contactoTelefono',
          'idTipoNaturalezaJuridica',
          'keydata',
          'direccion',
          'urlDominio',
          'urlFacebook',
          'urlTwitter',
          'urlLinkedin',
          'urlLogo',
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = idTipoNaturalezaJuridica)`), 'tipoNaturalezaJuridica'],
        ],
      })

      return res.status(200).json({ msg: 'success', data: entidades });
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

  async getUserEntidad(req, res) {
    try {
      const { token } = req;
      const entidad = await EntidadesModel.findOne({
        attributes: [
          'id',
          'nombre',
          'logo',
          'descripcion',
          'sigla',
          'tipo',
          'telefono',
          'email',
          'tipoEntidad',
          'contactoNombre',
          'contactoCorreo',
          'contactoTelefono',
          'idTipoNaturalezaJuridica',
          'keydata',
          'direccion',
          'urlDominio',
          'urlFacebook',
          'urlTwitter',
          'urlLinkedin',
          'urlLogo',
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = idTipoNaturalezaJuridica)`), 'tipoNaturalezaJuridica'],
        ],
        where: { idUserResponsable: token.id }
      })
      if (!entidad) return res.status(400).json({ type: 'error', msg: 'El usuario no cuenta con una entidad creada', status: 400 });

      return res.status(200).json({ msg: 'success', data: entidad });
    } catch (error) {
      throw error;
    }
  }

  async saveEntidad(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;

        const idContacto = body.idUser && token?.superadmin ? body.idUser : token?.id;
        const existResponsible = await EntidadesModel.findOne({ where: { idUserResponsable: idContacto } });
        if (existResponsible) return res.status(400).json({ type: 'error', msg: 'El usuario ya tiene una entidad a su cargo', status: 400 });

        const contact = await UsersModel.findByPk(idContacto);
        const keydata = await generateKeyWord();

        const postData = {
          nombre: body.nombre,
          sigla: body.sigla,
          tipo: body.tipo,
          descripcion: body.descripcion,
          idTipoNaturalezaJuridica: body.idTipoNaturalezaJuridica,
          logo: file ? file?.filename : null,
          idUserResponsable: contact?.id,
          email: body.email,
          contactoNombre: contact?.nombre,
          contactoCorreo: contact?.email,
          contactoTelefono: contact?.telefono,
          direccion: body.direccion,
          urlDominio: body.urlDominio,
          keydata: await bcrypt.hash(keydata, 10),
          telefono: body.telefono,
          urlFacebook: body.urlFacebook,
          urlTwitter: body.urlTwitter,
          urlLinkedin: body.urlLinkedin,
          createdBy: token.id
        }

        const model = await EntidadesModel.create(postData, { transaction: t });
        await registerKeyData(model.id, body.email.split('@')[0], keydata, 'EN');

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw (error);
    }
  }

  async updateFieldEntidad(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const { campo, value } = body;
        const id = req.params.idEntidad

        const entidad = await EntidadesModel.findByPk(id);

        if (entidad.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar la entidad', status: 400 });
        const validateKeyData = await validateKeyWord(id, 'EN', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        if (campo == 'nombre') {
          const exists = await validateFieldUnique('entidad', { 'nombre': value }, id)
          if (exists) return res.status(400).json({ type: 'error', msg: 'Ya existe una entidad con ese nombre', status: 400 });
        }
        const updateData = {
          [campo]: value,
          updatedBy: token.id
        }
        await entidad.update(updateData, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw (error);
    }
  }

  async updateLogoEntidad(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body } = req

        const entidad = await EntidadesModel.findByPk(req.params.idEntidad);
        if (entidad.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para editar la entidad', status: 400 });
        const validateKeyData = await validateKeyWord(req.params.idEntidad, 'EN', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const fileToDelete = entidad?.logo;
        await entidad.update({
          logo: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: entidad });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateLogoEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async deleteEntidad(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token } = req;
        const id = req.params.idEntidad

        const validateKeyData = await validateKeyWord(req.params.idEntidad, 'EN', req.query.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const entidad = await EntidadesModel.findByPk(id);
        if (entidad.idUserResponsable != token.id && !token.superadmin) return res.status(400).json({ type: 'error', msg: 'No tienes permisos para eliminar la entidad', status: 400 });
        const fileToDelete = entidad?.logo;

        await KeyWordsModel.destroy({ where: { id: validateKeyData.id } }, { transaction: t })
        await entidad.destroy({ transaction: t });
        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async getSelectEntidades(req, res) {
    try {
      const entidades = await EntidadesModel.findAll({
        attributes: ['id', 'nombre', 'idUserResponsable']
      })

      return res.status(200).json({ msg: "success", data: entidades });
    } catch (error) {
      throw error;
    }
  }
}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;