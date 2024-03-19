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
            [literal(`(SELECT CONCAT('${urlFiles}', servicio.imagen))`), 'imagen'],
            [literal('(SELECT x.nombre FROM x_tipos AS x WHERE x.id = servicio.id_tipo_servicio)'), 'tipoServicio'],
          ], required: false
        },
        {
          model: RetosTecnologicosModel, as: 'reto', attributes: [
            'id',
            'nombre',
            'fechaInicioConvocatoria',
            'fechaFinConvocatoria'
          ], required: false
        },
        {
          model: CursosModel, as: 'curso', attributes: [
            'id',
            'nombre',
            [literal(`(SELECT CONCAT('${urlFiles}', curso.imagen))`), 'imagen'],
            [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = curso.id_tipo_categoria)`), 'categoria'],
          ], required: false
        },
        {
          model: BibliotecaModel, as: 'biblioteca', attributes: [
            'id',
            'nombre',
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
        await FavoritosModel.create(postData, { transaction: t })

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFavorite(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params } = req;
        const id = params.idFavorito

        await FavoritosModel.destroy({ where: { id } }, { transaction: t });

        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

}
module.exports = FavoritosCTR;