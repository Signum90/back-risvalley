const { sequelize } = require('../db/connection');
const { Op, literal } = require('sequelize');
const CiudadesModel = require('../models/Ciudades');
const DepartamentosModel = require('../models/Departamentos');

class CiudadesDepartamentosCTR {
  async selectCiudades(req, res) {
    const { query } = req.query
    const idDepartamento = req.params.idDepartamento

    const cities = await CiudadesModel.findAll({
      where: {
        idDepartamento,
        ...(query ? { nombre: { [Op.like]: `%${query}%` } } : {}),
      }
    })

    return res.status(200).json({ msg: 'success', data: cities });
  }

  async selectDepartamentos(req, res) {
    const { query } = req.query;

    const departaments = await DepartamentosModel.findAll({
      where: {
        ...(query ? { nombre: { [Op.like]: `%${query}%` } } : {}),
      }
    })

    return res.status(200).json({ msg: 'success', data: departaments });
  }
}

module.exports = CiudadesDepartamentosCTR;