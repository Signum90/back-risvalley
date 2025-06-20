// #########################################
// ############### DATABASE ################
// #########################################
//■► IMPORTS:  ◄■:
const { Sequelize } = require('sequelize');
const config_db = require('../config/config');
const UsersModel = require('../models/Users');
const XTiposModel = require("../models/XTipos")
const EntidadesModel = require('../models/Entidades')
const CiudadesModel = require('../models/Ciudades');
const EventosModel = require('../models/Eventos');
const KeyWordsModel = require('../models/KeyWords');
const DepartamentosModel = require('../models/Departamentos');
const RecursosMultimediaModel = require('../models/RecursosMultimedia');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const RetosAspirantesModel = require('../models/RetosAspirantes');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const UsersValidacionesModel = require('../models/UsersValidaciones');
const PqrsModel = require('../models/Pqrs');
const FormatosModel = require('../models/Formatos');
const NotificacionesModel = require('../models/Notificaciones');
const BibliotecaModel = require('../models/Biblioteca');
const CursosModel = require('../models/Cursos');
const CursosSesionesModel = require('../models/CursosSesiones');
const CursosEstudiantesModel = require('../models/CursosEstudiantes')
const CursosClasesModel = require('../models/CursosClases');
const FavoritosModel = require('../models/Favoritos');

//■► CLASE: DataBase ◄■:
class DataBase {
  //■► MET: Constructor ◄■:
  constructor(sequelizeInstace) {
    //■► instancia ◄■:
    this.sequelize = sequelizeInstace || new Sequelize(config_db);

    this.XTiposModel = XTiposModel.initialize(this.sequelize);
    this.UsersModel = UsersModel.initialize(this.sequelize);
    this.EntidadesModel = EntidadesModel.initialize(this.sequelize);
    this.DepartamentosModel = DepartamentosModel.initialize(this.sequelize);
    this.CiudadesModel = CiudadesModel.initialize(this.sequelize);
    this.EventosModel = EventosModel.initialize(this.sequelize);
    this.KeyWordsModel = KeyWordsModel.initialize(this.sequelize);
    this.RecursosMultimediaModel = RecursosMultimediaModel.initialize(this.sequelize);
    this.RetosTecnologicosModel = RetosTecnologicosModel.initialize(this.sequelize);
    this.RetosAspirantesModel = RetosAspirantesModel.initialize(this.sequelize);
    this.ServiciosTecnologicosModel = ServiciosTecnologicosModel.initialize(this.sequelize);
    this.usersValidacionesModel = UsersValidacionesModel.initialize(this.sequelize);
    this.PqrsModel = PqrsModel.initialize(this.sequelize);
    this.FormatosModel = FormatosModel.initialize(this.sequelize);
    this.NotificacionesModel = NotificacionesModel.initialize(this.sequelize);
    this.BibliotecaModel = BibliotecaModel.initialize(this.sequelize);
    this.CursosModel = CursosModel.initialize(this.sequelize);
    this.CursosSesionesModel = CursosSesionesModel.initialize(this.sequelize);
    this.CursosEstudiantesModel = CursosEstudiantesModel.initialize(this.sequelize);
    this.CursosClasesModel = CursosClasesModel.initialize(this.sequelize);
    this.FavoritosModel = FavoritosModel.initialize(this.sequelize);
  }
  //■► MET: Autenticación de la DB ◄■:
  async authenticateDB() {
    //■► Try connect ◄■:
    try {
      await this.sequelize.authenticate();
      // Temporal Log
      console.log("Connect DB");
    } catch (error) {
      console.error('Error DB Connect', error);
    }
  }
  //■► MET: Sincronización de la DB ◄■:
  async synchronizeDB() {
    //■► Try sync ◄■:
    try {
      await this.sequelize.sync();
      // Temporal Log
      console.log("Synchronize DB");
    } catch (error) {
      console.error('Error DB Synchronize', error);
    }
  }
  //■► MET: Cerrar la DB ◄■:
  closeConnection() {
    this.sequelize.close();
  }
}
//■► EXPORTS:  ◄■:
module.exports = {
  DataBase,
  sequelize: new Sequelize(config_db)
}