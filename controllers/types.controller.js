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
                    { nombre: 'Sociedad Limitada', tipo: 1 },
                    { nombre: 'Empresa Unipersonal', tipo: 1 },
                    { nombre: 'Sociedad Anónima', tipo: 1 },
                    { nombre: 'Sociedad Colectiva', tipo: 1 },
                    { nombre: 'Sociedad en Comandita Simple', tipo: 1 },
                    { nombre: 'Sociedad en Comandita por Acciones', tipo: 1 },
                    { nombre: 'Sociedad por Acciones Simplificada', tipo: 1 },
                    { nombre: 'Empresa Asociativa de trabajo', tipo: 1 },
                    { nombre: 'Promoción y divulgación científica', tipo: 2 },
                    { nombre: 'Servicios tecnológicos', tipo: 2 },
                    { nombre: 'Apropiación social de conocimiento', tipo: 2 },
                    { nombre: 'Formación y capacitación', tipo: 2 },
                    { nombre: 'Gestión de la innovación y productividad', tipo: 2 },
                    { nombre: 'Comercialización de bienes/productos', tipo: 2 },
                    { nombre: 'Producción/elaboración de bienes/productos ', tipo: 2 },
                    { nombre: 'Otros', tipo: 2 },
                    { nombre: 'Centros de ciencia', tipo: 3 },
                    { nombre: 'Centros de desarrollo tecnológico ', tipo: 3 },
                    { nombre: 'Centros de innovación y productividad', tipo: 3 },
                    { nombre: 'Centros o institutos de innovación', tipo: 3},
                    { nombre: 'Sociedad', tipo: 3 },
                    { nombre: 'Entidades públicas', tipo: 3 },
                    { nombre: 'Entidad privadas', tipo: 3 },
                    { nombre: 'Empresas', tipo: 3 },
                    { nombre: 'Emprendedores', tipo: 3 },
                    { nombre: 'Startup', tipo: 3 },
                    { nombre: 'Entidades de educación superior', tipo: 3 },
                    { nombre: 'Entidades educativas ', tipo: 3 },
                    { nombre: 'ONG ', tipo: 3 },
                    { nombre: 'Corporaciones ambientales', tipo: 3 },
                    { nombre: 'Personas Naturales', tipo: 3 },
                    { nombre: 'Otros', tipo: 3 },
                ]
                await XTiposModel.bulkCreate(types, { transaction: t });
                res.status(200).json({
                    msg: types,
                });
            })
        } catch (error) {
            console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
        }
    }
    //■► MET: Listado de Usuarios ◄■:

}

//■► EXPORTAR:  ◄■:
module.exports = TypesCTR;