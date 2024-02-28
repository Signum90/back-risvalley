const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const UsersModel = require('../models/Users');
const EntidadesModel = require('../models/Entidades');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const EventosModel = require('../models/Eventos');

class GeneralsCTR {
    async getStadisticsSoftware(req, res) {
        try {
            const countUsers = await UsersModel.count();
            const countEntidades = await EntidadesModel.count();
            const countRetos = await RetosTecnologicosModel.count();
            const countServices = await ServiciosTecnologicosModel.count();
            const countEventos = await EventosModel.count()

            const data = {
                'totalUsers': countUsers,
                'totalEntidades': countEntidades,
                'totalRetos': countRetos,
                'totalServicios' : countServices,
                'totalEventos': countEventos
            }

            return res.status(200).json({ msg: 'success', data});

        } catch (error) {
            throw error;
        }
    }
}
module.exports = GeneralsCTR;

