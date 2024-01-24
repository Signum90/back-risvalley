// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { generateKeyWord, registerKeyData } = require('../helpers/helpers');
const bcrypt = require('bcrypt')
const UsersModel = require("../models/Users");

//■► CLASE: Controlador de Usuarios ◄■:
class UsersCTR {
  async registerUser(req = request, res = response) {
    return await sequelize.transaction(async (t) => {

      const { nombre, telefono, email, password } = req.body;

      const exists = await UsersModel.findOne({ where: { email } })
      if (exists) return res.status(400).json({ msg: "El correo electronico ya se encuentra registrado" });

      const passHash = await bcrypt.hash(password, 10);
      const keydata = await generateKeyWord(email.split('@')[0], 'U')

      const model = await UsersModel.create({
        nombre, telefono, email, keydata,
        password: passHash
      }, { transaction: t });

      await registerKeyData(model.id, email.split('@')[0], keydata, 'U')

      return res.status(200).json({ msg: "Usuario creado correctamente", data: model });
    })
  }

  async getUsers(req = request, res = response) {
    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email']
    })

    return res.status(200).json({ msg: "Usuario creado correctamente", data: users });
  }

}

module.exports = UsersCTR;