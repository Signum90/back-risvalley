// #########################################
// ############### SERVER ##################
// #########################################
//■► IMPORTS: Express  ◄■:
const express = require('express')
//■► IMPORTS: Cors ◄■:
const cors = require('cors');
//■► IMPORTS: ◄■:
const bodyParser = require('body-parser');
//■► IMPORTS: Data Base connect◄■:
const { DataBase, sequelize } = require('../db/connection')
//■► CLASE: SERVIDOR ◄■
class Server {

  //■► MET: Constructor ◄■
  constructor() {
    //■► puerto ◄■
    this.port = process.env.PORT;
    //■► instancia app ◄■
    this.app = express();
    //■► endpoint base ◄■
    this.endpoint_base = '/api';
    //■► endpoints de rutas ◄■
    this.endpoints = {
      auth: `${this.endpoint_base}/auth`,
      users: `${this.endpoint_base}/users`,
      types: `${this.endpoint_base}/tipos`,
      entidades: `${this.endpoint_base}/entidades`,
      eventos: `${this.endpoint_base}/eventos`,
      archivos: `${this.endpoint_base}/archivos`,
      retos: `${this.endpoint_base}/retos-tecnologicos`,
      servicios: `${this.endpoint_base}/servicios-tecnologicos`,
      ciudadesDepartamentos: `${this.endpoint_base}/departamentos`,
      pqrs: `${this.endpoint_base}/pqrs`
    }
    //■► lista blanca:
    this.whitelist = ['http://localhost:80',
      'http://localhost'];
    //■► configuracion cors:
    this.config_cors = {
      origin: (origin, callback) => {
        // Validate Origins >
        if (this.whitelist.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(null, true);
          // callback(new Error('Not allowed by CORS'));
        }
      }
    }
    //■► Instacia DB:
    this.database = new DataBase(sequelize);
    //■► Activar Middlewares:
    this.middlewares();
    //■► Activar Rutas:
    this.routes();
  }

  //■► MET: Conectar a la DB ◄■
  async start() {
    //■► autenticar ◄■
    await this.database.authenticateDB();
    //■► sincronizar ◄■
    await this.database.synchronizeDB();
    //■► ejecutar puerto ◄■
    this.listen()
  }

  //■► MET: Middlewares ◄■
  middlewares() {
    //■► cors ◄■
    this.app.use(cors(this.config_cors));
    this.app.use(express.json());
    //■► parsers ◄■
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  //■► MET: Rutas ◄■
  routes() {
    this.app.use(this.endpoints.auth, require('../routes/auth.routes'));
    this.app.use(this.endpoints.users, require('../routes/users.routes'));
    this.app.use(this.endpoints.types, require('../routes/types.routes'));
    this.app.use(this.endpoints.entidades, require('../routes/entidades.routes'));
    this.app.use(this.endpoints.eventos, require('../routes/eventos.routes'));
    this.app.use(this.endpoints.archivos, require('../routes/archivos.routes'));
    this.app.use(this.endpoints.retos, require('../routes/retosTecnologicos.routes'));
    this.app.use(this.endpoints.retos, require('../routes/retosAspirantes.routes'));
    this.app.use(this.endpoints.servicios, require('../routes/serviciosTecnologicos.routes'));
    this.app.use(this.endpoints.ciudadesDepartamentos, require('../routes/ciudadesDepartamentos.routes'));
    this.app.use(this.endpoints.pqrs, require('../routes/pqrs.routes'));
  }

  //■► MET: listen ◄■
  listen() {
    this.app.listen(this.port, () => {
      console.log(`On, Port: ${this.port}`);
    })
  }

}
//■► EXPORTS:  ◄■:
module.exports = Server;