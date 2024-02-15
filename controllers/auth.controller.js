// #########################################
// ####  CONTROLADOR AUTENTICACION #############
// ########################################
//■► PAQUETES EXTERNOS:  ◄■:
const bcrypt = require('bcrypt')
const config = require('../config/config');
const { generarJWT, sendEmail, generateCodeTemporal, registerUserValidate } = require('../helpers/helpers');
const { literal } = require('sequelize');
const { sequelize } = require('../db/connection');
const UsersModel = require('../models/Users');
const UsersValidacionesModel = require('../models/UsersValidaciones');

class AuthController {
  async login(req = request, res = response) {
    return await sequelize.transaction(async (t) => {
      const { correo, password } = req.body
      const user = await UsersModel.findByEmail(correo);
      if (!user) return res.status(401).json({ type: 'error', msg: 'Usuario no existe', status: 401 })

      if (bcrypt.compareSync(password, user.password)) {
        if (!user.registroValidado) return res.status(200).json({ data: { token: false, user: { id: user.id, registroValidado: false } } });
        await user.update({ sesionActiva: 1 }, { transaction: t })
        const token = await generarJWT({ id: user.id, keyData: user.keydata, superadmin: user.superadmin })
        const data = {
          id: user.id,
          superadmin: user.superadmin,
          nombre: user.nombre,
          telefono: user.telefono,
          email: user.email,
          sesionActiva: user.sesionActiva,
          keydata: user.keyData,
          registroValidado: user.registroValidado
        }
        return res.status(200).json({ data: { token, user: data } });
      } else {
        return res.status(401).json({ type: 'error', msg: 'Contraseña incorrecta', status: 401 })
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

  async validateUser(req, res) {
    return await sequelize.transaction(async (t) => {
      const { idUser, codigo } = req.body;

      const userCode = await UsersValidacionesModel.findOne({
        where: literal(`created_at >= NOW() - INTERVAL 1 DAY AND id_user = ${idUser}`),
        limit: 1,
        order: [['createdAt', 'Desc']],
      })
      const user = await UsersModel.findByPk(idUser, { where: { registroValidado: 0 } });
      if (!userCode) {
        if (!user) return res.status(400).json({ type: 'error', msg: 'el usuario se encuentra validado', status: 400 });
        const codeTemp = await generateCodeTemporal();
        await AuthController.sendEmailValidate(user.email, user.nombre, codeTemp, user.id);
        await registerUserValidate(user.id, codeTemp);
        return res.status(200).json({ data: true, msg: 'el código ingresado ya expiró, codigo reenviado correctamente' });
      }
      if (userCode.codigoTemporal != codigo) {
        return res.status(400).json({ type: 'error', msg: 'Codigo invalido', status: 400 });
      }
      await user.update({
        registroValidado: 1
      }, { transaction: t })

      return res.status(200).json({ data: true, msg: 'success' });
    })
  }

  static async sendEmailValidate(email, userName, code, id) {
    try {
      const fileEmail = path.join(__dirname, '../public/views/registerValidationEmail.hbs')
      readHTMLFile(fileEmail, async (err, html) => {
        const template = hbs.compile(html);
        const replacements = {
          userName,
          code,
          ruta: `${config.url.urlFront}/val-register/${id}`
        };
        const htmlToSend = template(replacements);
        let mailOptions = {
          to: email,
          subject: 'Bienvenido a rispark',
          html: htmlToSend,
        };
        await sendEmail(mailOptions);
      })
      return true
    } catch (error) {
      console.log("🚀 ~ UsersCTR ~ sendEmailValidate ~ error:", error)
      return 'error enviando los correos'
    }
  }
}

//■► EXPORTAR:  ◄■:
module.exports = AuthController;