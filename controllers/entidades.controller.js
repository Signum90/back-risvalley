// ###################################################
// ######### CONTROLADOR: TIPOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const EntidadesModel = require('../models/Entidades');
const { sequelize } = require('../db/connection');
const XTipoModel = require('../models/XTipos');
const { col } = require('sequelize');
//■► CLASE: Controlador de Usuarios ◄■:
class EntidadesCTR {
    async getEntidades(req = request, res = response) {
        try {
            const entidades = await EntidadesModel.findAll({
                attributes: ['id', 'nombre', [col('tipoNaturalezaJuridica.id'), 'idtiopo']],
                include: [
                    {
                        model: XTipoModel,
                        as: 'tipoNaturalezaJuridica',
                        attributes: ['id', ],
                        required: true
                    }
                ]
            })

            res.status(200).json({
                data: entidades,
            });
            return entidades;
        } catch (error) {
            console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
        }
    }

}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;