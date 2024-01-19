// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■:
const jwt = require('jsonwebtoken')

//■► CLASE: Helpers de Datos ◄■:
class Helpers {
  //■► MET: Crear JWT ◄■:
  generarJWT(id) {
    return new Promise((resolve, reject) => {
      const payload = { id };
      jwt.sign(payload, process.env.SECRETKEYJWT, {
        expiresIn: '1d'
      }, (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token')
        } else {
          //return token;
          resolve(token);
        }
      })

    })
  }
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();