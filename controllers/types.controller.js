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
        const types = [
          { nombre: 'Sociedad Limitada', clasificacion: 1 },
          { nombre: 'Empresa Unipersonal', clasificacion: 1 },
          { nombre: 'Sociedad Anónima', clasificacion: 1 },
          { nombre: 'Sociedad Colectiva', clasificacion: 1 },
          { nombre: 'Sociedad en Comandita Simple', clasificacion: 1 },
          { nombre: 'Sociedad en Comandita por Acciones', clasificacion: 1 },
          { nombre: 'Sociedad por Acciones Simplificada', clasificacion: 1 },
          { nombre: 'Empresa Asociativa de trabajo', clasificacion: 1 },
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
        ]
        await XTiposModel.bulkCreate(types, { transaction: t });

        return res.status(200).json({ data: types, msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

  async getTypes(req = request, res = response) {
    try {
      const types = await XTiposModel.findAll({
        attributes: ['id', 'nombre', 'descripcion'],
        where: {
          clasificacion: req.query.tipo
        }
      })
      return res.status(200).json({ msg: 'success', data: types });
    } catch (error) {
      console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
    }
  }

}

//■► EXPORTAR:  ◄■:
module.exports = TypesCTR;