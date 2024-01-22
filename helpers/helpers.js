// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■:
const jwt = require('jsonwebtoken')
const config_db = require('../config/config');

//■► CLASE: Helpers de Datos ◄■:
class Helpers {
  //■► MET: Crear JWT ◄■:
  generarJWT(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.SECRETKEYJWT, {
        expiresIn: '1d'
      }, (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token')
        } else {
          resolve(token);
        }
      })
    })
  }
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config_db.secret)
      return decoded
    } catch (e) {
      return false
    }
  }
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();