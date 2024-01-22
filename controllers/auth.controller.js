// #########################################
// ####  CONTROLADOR AUTENTICACION #############
// ########################################
//■► PAQUETES EXTERNOS:  ◄■:
const bcrypt = require('bcrypt')
const { request: req, response: res } = require('express');
const UsersModel = require('../models/Users');
const { generarJWT } = require('../helpers/helpers');

class AuthController {
  async login(req = request, res = response) {
    const { correo, password } = req.body
    let user = await UsersModel.findByEmail(correo);
    if (!user) return res.status(400).json({ errors: { username: ['Usuario no existe'] } })

    if (bcrypt.compareSync(password, user.password)) {
      const token = await generarJWT({ id: user.id, keyData: user.keydata })
      delete user.password
      res.status(200).json({ data: { token, user } });
    } else {
      res.status(400).json({ errors: { password: ['Contraseña incorrecta'] } })
    }
  }
}

//■► EXPORTAR:  ◄■:
module.exports = AuthController;