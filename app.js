// #########################################
// ########## MAIN SCRIPT ##################
// #########################################
//■► Var Enviroment  ◄■: 
require('dotenv').config();
//■► Server  ◄■: 
const Server = require('./server/server');
//■► Instacia servidor  ◄■: 
const server = new Server();
//■► Ejecutar servidor  ◄■: 
server.start();