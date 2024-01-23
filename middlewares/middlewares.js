// #########################################
// ######### MIDDLEWARES ##################
// ########################################
//■► PAQUETES EXTERNOS:  ◄■:
// const {request:req, response:res} = require('express')
const { validationResult } = require('express-validator');
const { verifyToken } = require('../helpers/helpers')

const invalidTokens = new Set()

class Middlewares {

  //■► METHOD: Escanea Errores / Express Validators ◄■
  scan_errors(req, res, next) {
    const errors = validationResult(req);
    // ■► Si Errores no esta vacio ◄■:
    if (!errors.isEmpty()) {
      const err = errors.errors[0];
      const { type, msg, path } = err;
      return res.status(400).json({
        type,
        msg,
        path
      });
    }
    // ■► next ◄■:
    next();
  }

  validateJWTMiddleware(req, res, next) {
    try {
      const { authorization } = req.headers
      if (!authorization) throw res.status(401).json({ msg: 'Token no proporcionado' });

      const token = authorization.split(' ')[1]
      if (invalidTokens.has(token)) throw res.status(401).json({ msg: 'Token inválido' });
      const tokenData = verifyToken(token);
      if (!tokenData) throw res.status(401).json({ msg: 'Token inválido' });
      req.token = tokenData;

      next();
    } catch (error) {
      console.log("🚀 ~ Middlewares ~ validateJWT ~ error:", error)
      next(error)
    }
  }

  logoutMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (token && !invalidTokens.has(token)) invalidTokens.add(token)
    next()
  }
}
//■► EXPORTS:  ◄■:
module.exports = new Middlewares()