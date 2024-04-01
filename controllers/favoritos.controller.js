const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const FavoritosModel = require('../models/Favoritos');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const CursosModel = require('../models/Cursos');
const BibliotecaModel = require('../models/Biblioteca');
const { urlFiles } = require('../config/config');

class FavoritosCTR {
  async getFavorites(req, res) {
    try {
      const token = req.token

      const favorites = await FavoritosModel.findAll({
        attributes: ['id', 'tipo', 'idServicio', 'idReto', 'idCurso', 'idBiblioteca'],
        where: {
          idUser: token.id
        },
        include: [{
          model: ServiciosTecnologicosModel, as: 'servicio', attributes: [
            'id',
            'nombre',
            'descripcion',
            [literal(`(SELECT CONCAT('${urlFiles}', servicio.imagen))`), 'imagen'],
            [literal('(SELECT x.nombre FROM x_tipos AS x WHERE x.id = servicio.id_tipo_servicio)'), 'tipoServicio'],
          ], required: false
        },
        {
          model: RetosTecnologicosModel, as: 'reto', attributes: [
            'id',
            'nombre',
            'descripcion',
            [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = reto.id_recurso_multimedia)`), 'recursoMultimedia'],
            'fechaInicioConvocatoria',
            'fechaFinConvocatoria'
          ], required: false
        },
        {
          model: CursosModel, as: 'curso', attributes: [
            'id',
            'nombre',
            'descripcion',
            [literal(`(SELECT CONCAT('${urlFiles}', curso.imagen))`), 'imagen'],
            [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = curso.id_tipo_categoria)`), 'categoria'],
          ], required: false
        },
        {
          model: BibliotecaModel, as: 'biblioteca', attributes: [
            'id',
            'nombre',
            'autor',
            'descripcion',
            [literal(`(SELECT CONCAT('${urlFiles}', biblioteca.imagen))`), 'imagen'],
            [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = biblioteca.id_tipo_categoria)`), 'categoria'],
          ], required: false
        }],
      })
      const data = [];
      for (let index = 0; index < favorites.length; index++) {
        const element = favorites[index];
        const { id, nombre, imagen, categoria, tipoServicio, fechaInicioConvocatoria, fechaFinConvocatoria, tipo } = element;
        data.push({
          id, nombre, imagen, categoria, tipoServicio, fechaInicioConvocatoria, fechaFinConvocatoria, tipo,
          data: element.servicio || element.biblioteca || element.reto || element.curso
        })
      }
      return res.status(200).json({ msg: 'success', data });

    } catch (error) {
      throw error;
    }
  }

  async postFavorite(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token } = req;
        const campos = {
          1: 'idServicio',
          2: 'idReto',
          3: 'idCurso',
          4: 'idBiblioteca'
        }
        const campo = campos[body.tipo];

        const postData = {
          [campo]: body.id,
          tipo: body.tipo,
          idUser: token.id,
          createdBy: token.id
        }
        const model = await FavoritosModel.create(postData, { transaction: t })

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFavorite(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params, token } = req;
        const id = params.idFavorito;

        const model = await FavoritosModel.findByPk(id);
        if (model.idUser != token.id) return res.status(400).json({ type: 'error', msg: 'No se puede eliminar' })

        await model.destroy({ transaction: t });

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

}
module.exports = FavoritosCTR;