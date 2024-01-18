// ###################################################
// ######### OBJETOS: RESPUESTAs #####################
// ###################################################
/**Objetos de respuestas: 
 * En este archivo se declaran
 * las posibles respuestas de las peticiones HTTP,
 * en la API, se deben usar para documentar las
 * respuestas a las peticiones ya sea de uso general
 * o peticiones con respuestas especificas.
 * 
 */
//■► RESPONSE: Generales ◄■: 
const generals = {
  // Ok
  success:{
    status: 200,
    msg: "success"
  },
  // Recurso Creado
  create:{
    status: 201,
    msg: "create"
  },
  // Petición Mal formada
  bad_request:{
    status: 400,
    msg:"bad-request"
  },
  // Se requier autenticación para realizar la petición
  unauthorized:{
    status: 401,
    msg: "unauthorized"
  },
  // Recurso no encontrado
  not_found:{
    status: 404,
    msg: "not-found"
  },
  // Error interno del servidor
  error_server:{
    statu: 500,
    msg: "server-error"
  }
}

module.exports = {
  generals
}



