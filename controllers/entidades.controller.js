// ###################################################
// ######### CONTROLADOR: TIPOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const EntidadesModel = require('../models/Entidades');
const { sequelize } = require('../db/connection');
const XTipoModel = require('../models/XTipos');
const { col, literal } = require('sequelize');
//■► CLASE: Controlador de Usuarios ◄■:
class EntidadesCTR {
    async getEntidades(req = request, res = response) {
        try {
            const entidades = await EntidadesModel.findAll({
                attributes: [
                    'id',
                    'nombre',
                    'sigla',
                    'tipo',
                    'tipoEntidad',
                    'contacto_nombre',
                    'contacto_cargo',
                    'contacto_correo',
                    'contacto_telefono',
                    'direccion',
                    'url_dominio',
                    //[literal(`(SELECT x.nombre FROM xTipos AS x WHERE x.id = entidades.id_tipo_naturaleza_juridica)`), 'tipoNaturalezaJuridica']
                    [col('tipoNaturalezaJuridica.id'), 'idTipoNaturalezaJuridica'], [col('tipoNaturalezaJuridica.nombre'), 'tipoNaturalezaJuridica'],
                    [col('tipoServicio.id'), 'idServicio'], [col('tipoServicio.nombre'), 'tipoServicio'],
                    [col('tipoClienteServicio.id'), 'idTipoClienteServicio'], [col('tipoClienteServicio.nombre'), 'tipoClienteServicio'],
                ],
                include: [{ model: XTipoModel, as: 'tipoNaturalezaJuridica', attributes: [] }],
                include: [{ model: XTipoModel, as: 'tipoServicio', attributes: [] }],
                include: [{ model: XTipoModel, as: 'tipoClienteServicio', attributes: [] }],
            })

            res.status(200).json({
                data: entidades,
            });
            return entidades;
        } catch (error) {
            console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
        }
    }

    async saveEntidad(req = request, res = response){}

}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;