const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const { deleteFile, validateFieldUnique, saveResourceMultimedia } = require('../helpers/helpers');
const { urlFiles } = require('../config/config');

class EntidadesCTR {
    async getTechnologicalChallenges(req, res) {
        try {
            return await sequelize.transaction(async (t) => {
                const now = new Date();
                await RetosTecnologicosModel.update({ estado: 3 }, { where: { fechaFinConvocatoria: { [Op.lt]: now } } }, { transaction: t })
                await RetosTecnologicosModel.update({ estado: 2 }, {
                    where: {
                        fechaInicioConvocatoria: { [Op.lte]: now },
                        fechaFinConvocatoria: { [Op.gte]: now }
                    }
                }, { transaction: t })

                const challenges = await RetosTecnologicosModel.findAll({
                    attributes: [
                        'id',
                        'nombre',
                        'descripcion',
                        'estado',
                        'estadoLabel',
                        'fechaInicioConvocatoria',
                        'fechaFinConvocatoria',
                        'fichaTecnica',
                        'urlFichaTecnica',
                        [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
                        [literal('(SELECT rm.tipo FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)'), 'tipoRecursoMultimedia'],
                    ],
                    where: {
                        estado: {
                            [Op.in]: [1, 2]
                        }
                    },
                    order: [['fechaInicioConvocatoria', 'DESC']]
                })
                return res.status(200).json({ msg: 'Consultado correctamente', data: challenges });
            })
        } catch (error) {
            throw error;
        }
    }


    async saveTechnologicalChallenge(req, res) {
        try {
            return await sequelize.transaction(async (t) => {
                const { body, token, files } = req;
                const { nombre, descripcion, fechaInicioConvocatoria, fechaFinConvocatoria } = body;
                const fichaTecnica = files['fichaTecnica'][0];
                const multimedia = files['recursoMultimedia'][0];
                if (!multimedia) return res.status(400).json({ msg: 'El recurso multimedia es requerido' });

                const recursoMultimediaRegistro = await saveResourceMultimedia(multimedia, token?.id);
                const model = await RetosTecnologicosModel.create({
                    nombre,
                    descripcion,
                    fechaInicioConvocatoria,
                    fechaFinConvocatoria,
                    idRecursoMultimedia: recursoMultimediaRegistro?.id,
                    fichaTecnica: fichaTecnica ? fichaTecnica?.filename : null,
                    createdBy: token.id
                }, { transaction: t })

                return res.status(200).json({ msg: 'Reto creado correctamente', data: model });
            })
        } catch (e) {
            throw e;
        }
    }
}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;