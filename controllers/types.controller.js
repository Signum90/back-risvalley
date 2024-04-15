// ###################################################
// ######### CONTROLADOR: TIPOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const XTiposModel = require("../models/XTipos");

//■► CLASE: Controlador de Usuarios ◄■:
class TypesCTR {
  //■► MET: Crear Usuarios ◄■:
  async saveTypes(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const existsTypes = await XTiposModel.findOne();
        if (existsTypes) return res.status(400).json({ type: 'error', status: 400, msg: 'Los tipos ya están creados' })

        const types = [
          { nombre: 'Sociedad Limitada', clasificacion: 1 },
          { nombre: 'Empresa Unipersonal', clasificacion: 1 },
          { nombre: 'Sociedad Anónima', clasificacion: 1 },
          { nombre: 'Sociedad Colectiva', clasificacion: 1 },
          { nombre: 'Sociedad en Comandita Simple', clasificacion: 1 },
          { nombre: 'Sociedad en Comandita por Acciones', clasificacion: 1 },
          { nombre: 'Sociedad por Acciones Simplificada', clasificacion: 1 },
          { nombre: 'Empresa Asociativa de trabajo', clasificacion: 1 },
          { nombre: 'Entidad sin animo de lucro', clasificacion: 1 },
          { nombre: 'Promoción y divulgación científica', clasificacion: 2 },
          { nombre: 'Servicios tecnológicos', clasificacion: 2 },
          { nombre: 'Apropiación social de conocimiento', clasificacion: 2 },
          { nombre: 'Formación y capacitación', clasificacion: 2 },
          { nombre: 'Gestión de la innovación y productividad', clasificacion: 2 },
          { nombre: 'Comercialización de bienes/productos', clasificacion: 2 },
          { nombre: 'Producción/elaboración de bienes/productos ', clasificacion: 2 },
          { nombre: 'Otros', clasificacion: 2 },
          { nombre: 'Centros de ciencia', clasificacion: 3 },
          { nombre: 'Centros de desarrollo tecnológico ', clasificacion: 3 },
          { nombre: 'Centros de innovación y productividad', clasificacion: 3 },
          { nombre: 'Centros o institutos de innovación', clasificacion: 3 },
          { nombre: 'Sociedad', clasificacion: 3 },
          { nombre: 'Entidades públicas', clasificacion: 3 },
          { nombre: 'Entidad privadas', clasificacion: 3 },
          { nombre: 'Empresas', clasificacion: 3 },
          { nombre: 'Emprendedores', clasificacion: 3 },
          { nombre: 'Startup', clasificacion: 3 },
          { nombre: 'Entidades de educación superior', clasificacion: 3 },
          { nombre: 'Entidades educativas ', clasificacion: 3 },
          { nombre: 'ONG ', clasificacion: 3 },
          { nombre: 'Corporaciones ambientales', clasificacion: 3 },
          { nombre: 'Personas Naturales', clasificacion: 3 },
          { nombre: 'Otros', clasificacion: 3 },
          { nombre: 'Ciencia', imagen: 'imagen-categoria-ciencia.jpg', clasificacion: 4 },
          { nombre: 'Tecnologia', imagen: 'imagen-categoria-tecnologia.jpg', clasificacion: 4 },
          { nombre: 'Conocimiento especializado', imagen: 'imagen-categoria-especializado.jpg', clasificacion: 4 },
          { nombre: 'Conocimiento común', imagen: 'imagen-categoria-comun.jpg', clasificacion: 4 },
          { nombre: 'Otros', imagen: 'imagen-otros.jpg', clasificacion: 4 },
        ]
        await XTiposModel.bulkCreate(types, { transaction: t });

        return res.status(200).json({ data: types, msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

  async postCategory(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body, file } = req;

        const postData = {
          imagen: file?.filename,
          nombre: body.nombre,
          clasificacion: 4,
          createdBy: token.id
        }
        const model = await XTiposModel.create(postData, { transaction: t });

        return res.status(200).json({ data: model, msg: 'success' });
      })
    } catch (error) {
      throw error;
    }
  }

  async getTypes(req = request, res = response) {
    try {
      const { tipo, preview } = req.query

      const types = await XTiposModel.findAll({
        attributes: [
          'id',
          'nombre',
          'imagen',
          'urlImagen'
        ],
        where: {
          clasificacion: tipo
        },
        limit: preview ? 10 : null
      })
      return res.status(200).json({ msg: 'success', data: types });
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

}

//■► EXPORTAR:  ◄■:
module.exports = TypesCTR;