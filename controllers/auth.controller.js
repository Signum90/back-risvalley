// #########################################
// ####  CONTROLADOR AUTENTICACION #############
// ########################################
//■► PAQUETES EXTERNOS:  ◄■:
const bcrypt = require('bcrypt')
const UsersModel = require('../models/Users');
const { generarJWT } = require('../helpers/helpers');
const { sequelize } = require('../db/connection');

class AuthController {
  async login(req = request, res = response) {
    return await sequelize.transaction(async (t) => {
      const { correo, password } = req.body
      const user = await UsersModel.findByEmail(correo);
      if (!user) return res.status(400).json({ errors: { username: ['Usuario no existe'] } })

      if (bcrypt.compareSync(password, user.password)) {
        await user.update({ sesionActiva: 1 }, { transaction: t })
        const token = await generarJWT({ id: user.id, keyData: user.keydata, superadmin: user.superadmin })
        const data = {
          id: user.id,
          superadmin: user.superadmin,
          nombre: user.nombre,
          telefono: user.telefono,
          email: user.email,
          sesionActiva: user.sesionActiva,
          keydata: user.keyData
        }
        res.status(200).json({ data: { token, user: data } });
      } else {
        res.status(400).json({ errors: { password: ['Contraseña incorrecta'] } })
      }
    })
  }

  async logout(req, res) {
    return await sequelize.transaction(async (t) => {
      const { token } = req;
      await UsersModel.update({ sesionActiva: 0 },
        { where: { id: token.id } },
        { transaction: t })

      res.status(200).json({ data: true, msg: 'Logout exitoso' });
    })
  }
}

//■► EXPORTAR:  ◄■:
module.exports = AuthController;