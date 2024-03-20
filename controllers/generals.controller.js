const UsersModel = require('../models/Users');
const EntidadesModel = require('../models/Entidades');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const EventosModel = require('../models/Eventos');
const PqrsModel = require('../models/Pqrs');

class GeneralsCTR {
  async getStadisticsSoftware(req, res) {
    try {
      const countUsers = await UsersModel.count();
      const countEntidades = await EntidadesModel.count();
      const countRetos = await RetosTecnologicosModel.count();
      const countServices = await ServiciosTecnologicosModel.count();
      const countEventos = await EventosModel.count();
      const countPQRs = await PqrsModel.count();

      const data = {
        'totalUsers': countUsers,
        'totalEntidades': countEntidades,
        'totalRetos': countRetos,
        'totalServicios': countServices,
        'totalEventos': countEventos,
        'totalPQRs': countPQRs
      }

      return res.status(200).json({ msg: 'success', data });

    } catch (error) {
      console.log("🚀 ~ GeneralsCTR ~ getStadisticsSoftware ~ error:", error)
      throw error;
    }
  }
}
module.exports = GeneralsCTR;

