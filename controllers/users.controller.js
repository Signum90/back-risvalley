// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { generateKeyWord, registerKeyData, generateCodeTemporal, sendEmail } = require('../helpers/helpers');
const { readHTMLFile } = require('../config/email')
const hbs = require('hbs');
const bcrypt = require('bcrypt')
const path = require('path');
const UsersModel = require("../models/Users");
const UsersValidacionesModel = require('../models/UsersValidaciones');

//■► CLASE: Controlador de Usuarios ◄■:
class UsersCTR {
  static async sendEmailValidate(email, userName, code) {
    try {
      const fileEmail = path.join(__dirname, '../public/views/registerValidationEmail.hbs')
      readHTMLFile(fileEmail, async (err, html) => {
        const template = hbs.compile(html);
        const replacements = {
          userName,
          code,
          ruta: 'https://risparktest.cpcoriente.org/'
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

      const codeTemp = await generateCodeTemporal();
      await UsersCTR.sendEmailValidate(model.email, model.nombre, codeTemp)
      await UsersCTR.registerUserValidate(model.id, codeTemp)
      // await UsersValidacionesModel.create({
      //   idUser: model.id,
      //   codigoTemporal: codeTemp
      // });
      return res.status(200).json({ msg: "Usuario creado correctamente", data });
    })
  }

  static async registerUserValidate(idUser, codigoTemporal) {
    //try {
    return await sequelize.transaction(async (t) => {
      await UsersValidacionesModel.create({
        idUser,
        codigoTemporal
      }, { transaction: t });
    })
    // } catch (error) {
    // throw error;
    // }
  }

  async getUsers(req = request, res = response) {
    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email', 'urlLogo', 'superadmin', 'tipo']
    })

    return res.status(200).json({ msg: "Usuario creado correctamente", data: users });
  }

}

module.exports = UsersCTR;