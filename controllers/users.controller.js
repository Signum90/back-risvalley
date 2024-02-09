// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { generateKeyWord, registerKeyData, generateCodeTemporal, sendEmail, registerUserValidate } = require('../helpers/helpers');
const { readHTMLFile } = require('../config/email')
const hbs = require('hbs');
const bcrypt = require('bcrypt')
const path = require('path');
const config = require('../config/config');
const UsersModel = require("../models/Users");

//■► CLASE: Controlador de Usuarios ◄■:
class UsersCTR {
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
      return true;
    } catch (error) {
      console.log("🚀 ~ UsersCTR ~ sendEmailValidate ~ error:", error)
      return 'error enviando los correos'
    }
  }

  async registerUser(req = request, res = response) {
    try {
      const { file, body } = req
      const { nombre, telefono, email, password, tipo } = body;

      const passHash = await bcrypt.hash(password, 10);
      const keydata = await generateKeyWord(email.split('@')[0], 'U')

      const model = await sequelize.transaction(async (t) => {
        return await UsersModel.create({
          nombre, telefono, email, keydata, tipo,
          logo: file ? file?.filename : null,
          password: passHash
        }, { transaction: t });
      })

      await registerKeyData(model.id, email.split('@')[0], keydata, 'U')
      const data = {
        id: model.id,
        nombre: model.nombre,
        telefono: model.telefono,
        email: model.email,
        //keydata: model.keydata,
        superadmin: model.superadmin,
        urlLogo: model.urlLogo,
        tipo: model.tipo,
        registroValidado: 0
      }

      const codeTemp = await generateCodeTemporal();
      await UsersCTR.sendEmailValidate(model.email, model.nombre, codeTemp, model.id);
      await registerUserValidate(model.id, codeTemp);
      return res.status(200).json({ msg: "Usuario creado correctamente", data });
    } catch (error) {
      throw error
    }
  }

  async getUsers(req = request, res = response) {
    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email', 'urlLogo', 'superadmin', 'tipo']
    })

    return res.status(200).json({ msg: "Usuario creado correctamente", data: users });
  }

}

module.exports = UsersCTR;