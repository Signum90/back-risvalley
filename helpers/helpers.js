// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■: 
const jwt = require('jsonwebtoken')

//■► CLASE: Helpers de Datos ◄■: 
class Helpers {
  //■► MET: Crear JWT ◄■: 
  generarJWT(){
    
    return new Promise( (resolve, reject) => {
      
      //■► id usuario /  ◄■: 
      const payload = { uid };
      
      //■► id usuario /  ◄■: 
      jwt.sign( payload, process.env.SECRETKEYJWT, {
        
        expiresIn: '1d'

      }, ( err, token ) => {

        if ( err ) {
          console.log(err);
          reject( 'No se pudo generar el token' )
        } else {
          resolve( token );
        }

      })

    })
  }
  //■► MET: Crear JWT ◄■: 
  response_handlers(){

  }
}
//■► EXPORTAR:  ◄■: 
module.exports = new Helpers();