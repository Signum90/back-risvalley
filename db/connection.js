// #########################################
// ############### DATABASE ################
// #########################################
//■► IMPORTS:  ◄■: 
const { Sequelize } = require('sequelize');
const config_db = require('../config/config');
const UsersModel = require('../models/Users');

//■► CLASE: DataBase ◄■: 
class DataBase {
  //■► MET: Constructor ◄■: 
  constructor() {
    //■► instancia ◄■: 
    this.sequelize = new Sequelize(config_db);
    //■► Construccion de modelos ◄■: USUARIOS 
    this.UsersModel = UsersModel.initialize(this.sequelize);
  }
  //■► MET: Autenticación de la DB ◄■: 
  async authenticateDB(){
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
  async synchronizeDB(){
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
  closeConnection(){
    this.sequelize.close();
  }
}
//■► EXPORTS:  ◄■: 
module.exports = {
  DataBase,
  sequelize: new Sequelize(config_db)
}