// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const UsersModel = require("../models/Users");

//■► CLASE: Controlador de Usuarios ◄■:
class UsersCTR {
  async registerUser(req = request, res = response) {
    return await sequelize.transaction(async (t) => {

      const { nombre, telefono, email, password } = req.body;

      const exists = await UsersModel.findOne({where: { email }})
      if( exists ) return res.status(400).json({ msg: "El correo electronico ya se encuentra registrado" });

      const passHash = await bcrypt.hash(password, 10);
      const keyData = await crypto.randomBytes(16).toString('hex');

      const model = await UsersModel.create({
        nombre, telefono, email,
        password: passHash,
        keydata: email.split('@')[0] + keyData
      }, { transaction: t })

      return res.status(200).json({ msg: "Usuario creado correctamente", data: model });

    })

  }

}

module.exports = UsersCTR;