// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■: 
const { response, request } = require('express');

//■► CLASE: Controlador de Usuarios ◄■: 
class UsersCTR {
  //■► MET: Crear Usuarios ◄■: 
  async create_users(req=request, res=response){
    const {nombre} = req.body
    res.status(200).json({
      msg: "Creando Usuario",
      nombre
    });

  }
  //■► MET: Listado de Usuarios ◄■: 
  get_users(){
    console.log("Enviando Usuarios");  
  }

}

//■► EXPORTAR:  ◄■: 
module.exports = UsersCTR;