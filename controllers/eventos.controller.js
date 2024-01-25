// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const EventosModel = require('../models/Eventos');
const { Op, literal } = require('sequelize');

//■► CLASE: Controlador de Usuarios ◄■:
class EventosCTR {
    async getEvents(req = request, res = response) {
        try {
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
                    'tipoResponsable',
                    'createdBy',
                    [literal('(SELECT c.nombre FROM ciudades AS c WHERE c.id = eventos.id_ciudad)'), 'ciudad'],
                    [literal('(SELECT d.nombre FROM ciudades AS c INNER JOIN departamentos AS d ON d.id = c.id_departamento WHERE c.id = eventos.id_ciudad)'), 'departamento']
                ],
                where: { estado: { [Op.in]: [1, 2] } },
                order: [['fechaInicio', 'ASC']]
            })
            res.status(200).json({ msg: 'Consultado correctamente', data: events });
        } catch (error) {
            return res.status(400).json({ data: error });
        }
    }

    async saveEvent(req = request, res = response) {
        try {
            return await sequelize.transaction(async (t) => {

                const { nombre, descripcion, fechaInicio, urlRegistro, precio, tipoResponsable, idCiudad } = req.body;
                const { file } = req
                const token = req.token;

                const model = await EventosModel.create({
                    nombre, descripcion, urlRegistro, precio, tipoResponsable, idCiudad,
                    logo: file?.destination.split('/').splice(1, 1) + '/' + file?.filename,
                    createdBy: token.id,
                    fechaInicio: new Date(fechaInicio)
                }, { transaction: t })

                res.status(200).json({ msg: 'Evento creado correctamente', data: model });
            })
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}

module.exports = EventosCTR;