// #########################################
// ######### MIDDLEWARES ##################
// ########################################
//■► PAQUETES EXTERNOS:  ◄■: 
// const {request:req, response:res} = require('express')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


class Middlewares {

  //■► METHOD: Escanea Errores / Express Validators ◄■
  scan_errors(req, res, next){
    const errors = validationResult(req);
    // ■► Si Errores no esta vacio ◄■: 
    if(!errors.isEmpty()){
      // ■► get errors ◄■: 
      const err = errors.errors[0];
      // ■► destructure errors ◄■: 
      const {type, msg, path} = err;
      // ■► return errors ◄■: 
      return res.status(400).json({
        type,
        msg,
        path
      });
    }
    // ■► next ◄■: 
    next();
  }
  validateJWT(req, res, next){
    const token = req.header('x-token')

    try {
      const { uid } = jwt.verify( token, process.env.SECRETKEYJWT);

    } catch (error) {
      
    }
  }
}
//■► EXPORTS:  ◄■: 
module.exports = new Middlewares()