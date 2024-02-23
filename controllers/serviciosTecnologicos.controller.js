const { sequelize } = require('../db/connection');
const { literal, col, Op } = require('sequelize');
const { deleteFile } = require('../helpers/helpers');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const UsersModel = require('../models/Users');

class ServiciosTecnologicosCTR {
  async getTechnologicalService(req, res) {
    try {
      const { nombre, idTipoServicio, idTipoClienteServicio, page } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;

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
          [literal(`(SELECT url_dominio FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'urlDominio'],
          [literal(`(SELECT e.nombre FROM entidades AS e WHERE id_user_responsable = contacto.id)`), 'nombreEntidad'],
        ],
        where: {
          estado: 1,
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(idTipoServicio ? { idTipoServicio } : {}),
          ...(idTipoClienteServicio ? { idTipoClienteServicio } : {}),
        },
        include: [{ model: UsersModel, as: 'contacto', attributes: [] }],
        offset: (paginate - 1) * pageSize,
        limit: pageSize
      })

      return res.status(200).json({ msg: 'success', data: services });
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

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async postTechnologicalServiceFromDashboard(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, file, token } = req;

        const postData = {
          nombre: body.nombre,
          descripcion: body.descripcion,
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          imagen: file ? file?.filename : null,
          createdBy: body.idUserContacto
        };
        const model = await ServiciosTecnologicosModel.create(postData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }


  async updateTechnologicalService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const id = req.params.idServicio;

        const editData = {
          nombre: body.nombre,
          descripcion: body.descripcion,
          idTipoServicio: body.idTipoServicio,
          idTipoClienteServicio: body.idTipoClienteServicio,
          updatedBy: token.id
        };
        await ServiciosTecnologicosModel.update(editData, { where: { id } }, { transaction: t });

        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      throw (error);
    }
  }

  async updateLogoService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token } = req

        const service = await ServiciosTecnologicosModel.findByPk(req.params.idServicio);
        const fileToDelete = service?.imagen;
        await service.update({
          imagen: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: service });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteService(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const id = req.params.idServicio

        const service = await ServiciosTecnologicosModel.findByPk(id);
        const fileToDelete = service?.imagen;

        await service.destroy({ transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success' });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateEvent ~ error:", error)
      return res.status(400).json(error)
    }
  }

}

module.exports = ServiciosTecnologicosCTR;