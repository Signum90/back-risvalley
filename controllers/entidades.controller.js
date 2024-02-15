// ###################################################
// ######### CONTROLADOR: ENTIDADES ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const EntidadesModel = require('../models/Entidades');
const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { deleteFile, validateFieldUnique } = require('../helpers/helpers');

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
          'contactoNombre',
          //'contactoCargo',
          'contactoCorreo',
          'contactoTelefono',
          'idTipoNaturalezaJuridica',
          'direccion',
          'urlDominio',
          'urlFacebook',
          'urlTwitter',
          'urlLinkedin',
          'urlLogo',
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = entidades.id_tipo_naturaleza_juridica)`), 'tipoNaturalezaJuridica'],
        ],
      })

      res.status(200).json({ msg: 'success', data: entidades });
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

  async saveEntidad(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;

        const postData = {
          nombre: body.nombre,
          sigla: body.sigla,
          tipo: body.tipo,
          descripcion: body.descripcion,
          idTipoNaturalezaJuridica: body.idTipoNaturalezaJuridica,
          logo: file ? file?.filename : null,
          idUserResponsable: token.id,
          contactoNombre: body.contactoNombre,
          //contactoCargo: body.contactoCargo,
          contactoCorreo: body.contactoCorreo,
          contactoTelefono: body.contactoTelefono,
          direccion: body.direccion,
          urlDominio: body.urlDominio,
          urlFacebook: body.urlFacebook,
          urlTwitter: body.urlTwitter,
          urlLinkedin: body.urlLinkedin,
          createdBy: token.id
        }

        const model = await EntidadesModel.create(postData, { transaction: t });

        res.status(200).json({ msg: 'success', data: model });
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
        if (campo == 'nombre') {
          const exists = await validateFieldUnique('entidad', 'nombre', value, id)
          if (exists) return res.status(400).json({ type: 'error', msg: 'Ya existe una entidad con ese nombre', status: 400 });
        }
        const updateData = {
          [campo]: value,
          updatedBy: token.id
        }
        await EntidadesModel.update(updateData, { where: { id } }, { transaction: t });

        res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw (error);
    }
  }

  async updateLogoEntidad(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token } = req

        const entidad = await EntidadesModel.findByPk(req.params.idEntidad);
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
        res.status(200).json({ msg: 'success', data: entidad });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateLogoEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

  async deleteEntidad(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idEntidad

        const entidad = await EntidadesModel.findByPk(id);
        const fileToDelete = entidad?.logo;

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
}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;