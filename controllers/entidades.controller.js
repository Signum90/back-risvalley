// ###################################################
// ######### CONTROLADOR: ENTIDADES ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const EntidadesModel = require('../models/Entidades');
const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');


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
                    'contactoCargo',
                    'contactoCorreo',
                    'contactoTelefono',
                    'idTipoNaturalezaJuridica',
                    'idTipoServicio',
                    'idTipoClienteServicio',
                    'direccion',
                    'nombreServicio',
                    'descripcionServicio',
                    'urlDominio',
                    'urlFacebook',
                    'urlTwitter',
                    'urlLinkedin',
                    [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = entidades.id_tipo_naturaleza_juridica)`), 'tipoNaturalezaJuridica'],
                    [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = entidades.id_tipo_servicio)`), 'tipoServicio'],
                    [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = entidades.id_tipo_cliente_servicio)`), 'tipoClienteServicio']
                ],
            })

            res.status(200).json({ msg: 'Consultado correctamente', data: entidades });
        } catch (error) {
            console.log("🚀 ~ TypesCTR ~ saveTypes ~ error:", error)
        }
    }

    async saveEntidad(req = request, res = response) {
        try {
            return await sequelize.transaction(async (t) => {
                const { body } = req;

                const postData = {
                    nombre: body.nombre,
                    sigla: body.sigla,
                    tipo: body.tipo,
                    descripcion: body.descripcion,
                    idTipoNaturalezaJuridica: body.idTipoNaturalezaJuridica,
                    logo: body.logo,
                    contactoNombre: body.contactoNombre,
                    contactoCargo: body.contactoCargo,
                    contactoCorreo: body.contactoCorreo,
                    contactoTelefono: body.contactoTelefono,
                    direccion: body.direccion,
                    urlDominio: body.urlDominio,
                    urlFacebook: body.urlFacebook,
                    urlTwitter: body.urlTwitter,
                    urlLinkedin: body.urlLinkedin,
                    idTipoServicio: body.idTipoServicio,
                    idTipoClienteServicio: body.idTipoClienteServicio,
                    nombreServicio: body.nombreServicio,
                    descripcionServicio: body.descripcionServicio,
                    createdBy: req.token.id
                }

                const model = await EntidadesModel.create(postData, { transaction: t });

                res.status(200).json({ msg: 'Entidad creada correctamente', data: model });
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

                const updateData = { updatedBy: token.id }
                updateData[campo] = value;

                await EntidadesModel.update(updateData, { where: { id } }, { transaction: t });

                res.status(200).json({ msg: 'Entidad editada correctamente' });
            })
        } catch (error) {
            throw (error);
        }
    }
}

//■► EXPORTAR:  ◄■:
module.exports = EntidadesCTR;