// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { generateKeyWord, registerKeyData, generateCodeTemporal, sendEmail, registerUserValidate, generatePasswordTemporal } = require('../helpers/helpers');
const { readHTMLFile } = require('../config/email')
const hbs = require('hbs');
const bcrypt = require('bcrypt')
const path = require('path');
const config = require('../config/config');
const UsersModel = require("../models/Users");
const EntidadesModel = require('../models/Entidades');

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
      const { file, body, token } = req;
      const { nombre, telefono, email, password, tipo, cargo, superadmin } = body;
      let passHash
      let passTemp
      if (!token) {
        passHash = await bcrypt.hash(password, 10);
      } else {
        passTemp = await generatePasswordTemporal()
        passHash = await bcrypt.hash(passTemp, 10);
      }
      const keydata = await generateKeyWord(email.split('@')[0], 'U')

      const model = await sequelize.transaction(async (t) => {
        return await UsersModel.create({
          nombre, telefono, email, keydata, cargo,
          tipo: token ? tipo : 1,
          superadmin: token ? superadmin : 0,
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

      if (token) {
        if (tipo != 1) {
          const entidad = await UsersCTR.saveEntidad(body, model.id, model.logo)
          data.entidad = entidad;
        };
        await UsersCTR.sendEmailValidate(model.email, model.nombre, passTemp, model.id);
      } else {
        const codeTemp = await generateCodeTemporal();
        await UsersCTR.sendEmailValidate(model.email, model.nombre, codeTemp, model.id);
        await registerUserValidate(model.id, codeTemp);
      }

      return res.status(200).json({ msg: "success", data });
    } catch (error) {
      throw error
    }
  }

  async getUsers(req = request, res = response) {
    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email', 'urlLogo', 'superadmin', 'tipo']
    })

    return res.status(200).json({ msg: "success", data: users });
  }

  static async saveEntidad(body, id, logo = null) {
    try {
      return await sequelize.transaction(async (t) => {

        const postData = {
          nombre: body.nombreEntidad,
          sigla: body.sigla,
          tipo: body.tipoEntidad,
          descripcion: body.descripcion,
          idTipoNaturalezaJuridica: body.idTipoNaturalezaJuridica,
          logo,
          idUserResponsable: id,
          contactoNombre: body.nombre,
          //contactoCargo: body.cargo,
          contactoCorreo: body.email,
          contactoTelefono: body.telefono,
          direccion: body.direccion,
          urlDominio: body.urlDominio,
          urlFacebook: body.urlFacebook,
          urlTwitter: body.urlTwitter,
          urlLinkedin: body.urlLinkedin,
          telefono: body.telefonoEntidad,
          email: body.emailEntidad
          //createdBy
        }

        return await EntidadesModel.create(postData, { transaction: t });

        //return true;
      })
    } catch (error) {
      throw (error);
    }
  }

}

module.exports = UsersCTR;