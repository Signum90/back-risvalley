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

//■► CLASE: DataBase ◄■:
class DataBase {
  //■► MET: Constructor ◄■:
  constructor(sequelizeInstace) {
    //■► instancia ◄■:
    this.sequelize = sequelizeInstace || new Sequelize(config_db);
    //■► Construccion de modelos ◄■:USUARIOS
    this.XTiposModel = XTiposModel.initialize(this.sequelize);
    this.UsersModel = UsersModel.initialize(this.sequelize);
    this.EntidadesModel = EntidadesModel.initialize(this.sequelize);
    this.CiudadesModel = CiudadesModel.initialize(this.sequelize);
    this.EventosModel = EventosModel.initialize(this.sequelize);

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