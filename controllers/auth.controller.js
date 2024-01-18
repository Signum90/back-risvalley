// #########################################
// ####  CONTROLADOR USUARIOS #############
// ########################################
//■► PAQUETES EXTERNOS:  ◄■: 
const { request:req, response:res } = require('express');

class AuthController {
  
  login(req, res){
    res.status(200).json({
      msg: 'success'
    })
  }
}

//■► EXPORTAR:  ◄■:
module.exports = AuthController;