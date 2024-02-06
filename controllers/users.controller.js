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
      const { file, body } = req
      const { nombre, telefono, email, password, tipo } = body;

      const passHash = await bcrypt.hash(password, 10);
      const keydata = await generateKeyWord(email.split('@')[0], 'U')

      const model = await UsersModel.create({
        nombre, telefono, email, keydata, tipo,
        logo: file ? file?.filename : null,
        password: passHash
      }, { transaction: t });

      await registerKeyData(model.id, email.split('@')[0], keydata, 'U')
      const data = {
        id: model.id,
        nombre: model.nombre,
        telefono: model.telefono,
        email: model.email,
        keydata: model.keydata,
        superadmin: model.superadmin,
        urlLogo: model.urlLogo,
        tipo: model.tipo
      }
      return res.status(200).json({ msg: "Usuario creado correctamente", data });
    })
  }

  async getUsers(req = request, res = response) {
    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email', 'urlLogo', 'superadmin', 'tipo']
    })

    return res.status(200).json({ msg: "Usuario creado correctamente", data: users });
  }

}

module.exports = UsersCTR;