const { sequelize } = require('../db/connection');
const { literal, col, Op } = require('sequelize');
const { deleteFile, validateFieldUnique } = require('../helpers/helpers');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const UsersModel = require('../models/Users');

class ServiciosTecnologicosCTR {
  async getTechnologicalService(req, res) {
    try {
      const { nombre, idTipoServicio, idTipoClienteServicio } = req.query

      const services = await ServiciosTecnologicosModel.findAll({
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado',
          'idTipoServicio',
          'idTipoClienteServicio',
          'imagen',
          'urlImagen',
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoServicio)'), 'tipoServicio'],
          [literal('(SELECT x.nombre FROM x_tipos AS x WHERE id = idTipoClienteServicio)'), 'tipoClienteServicio'],
          [col('contacto.nombre'), 'nombreContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.telefono'), 'telefonoContacto'],
          [col('contacto.email'), 'correoContacto'],
          [literal(`(SELECT url_dominio FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlDominio']
        ],
        where: {
          estado: 1,
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(idTipoServicio ? { idTipoServicio } : {}),
          ...(idTipoClienteServicio ? { idTipoClienteServicio } : {}),
        },
        include: [{ model: UsersModel, as: 'contacto', attributes: [] }],
      })

      return res.status(200).json({ msg: 'Consultado correctamente', data: services });
    } catch (error) {
      throw error;
    }
  }

  async postTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;

        const postData = {
          nombre: body.nombre,
          descripcion: body.descripcion,
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          imagen: file ? file?.filename : null,
          createdBy: token.id
        };
        const model = await ServiciosTecnologicosModel.create(postData, { transaction: t });

        res.status(200).json({ msg: 'Servicio creado correctamente', data: model });
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ServiciosTecnologicosCTR;