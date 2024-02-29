// ###################################################
// ######### CONTROLADOR: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { response, request } = require('express');
const { sequelize } = require('../db/connection');
const { generateKeyWord, registerKeyData, generateCodeTemporal, sendEmail, registerUserValidate, generatePasswordTemporal, validateKeyWord, deleteFile } = require('../helpers/helpers');
const { readHTMLFile } = require('../config/email')
const hbs = require('hbs');
const bcrypt = require('bcrypt')
const path = require('path');
const config = require('../config/config');
const UsersModel = require("../models/Users");
const EntidadesModel = require('../models/Entidades');
const { literal, Op } = require('sequelize');
const KeyWordsModel = require('../models/KeyWords');

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
      const keydata = await generateKeyWord()
      const model = await sequelize.transaction(async (t) => {
        return await UsersModel.create({
          nombre, telefono, email,
          cargo: token ? cargo : 'Sin registro',
          keydata: await bcrypt.hash(keydata, 10),
          tipo: token ? tipo : 1,
          primerIngreso: token ? 1 : 0,
          registroValidado: 0,
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
        keydata: model.keydata,
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
    const page = req?.query?.page ?? 1;
    const pageSize = 10;

    const users = await UsersModel.findAll({
      attributes: ['id', 'nombre', 'telefono', 'email', 'urlLogo', 'superadmin', 'tipo', 'keydata', 'registroValidado', 'cargo'],
      include: [{
        model: EntidadesModel,
        as: 'entidad',
        attributes: [
          'id',
          'nombre',
          'sigla',
          'keydata',
          'tipo',
          'tipoEntidad',
          'descripcion',
          'idTipoNaturalezaJuridica',
          'logo',
          'urlLogo',
          'direccion',
          'urlDominio',
          'urlFacebook',
          'urlTwitter',
          'urlLinkedin',
          'telefono',
          'email',
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = entidad.id_tipo_naturaleza_juridica)`), 'tipoNaturalezaJuridica'],
        ]
      }],
      order: [['createdAt', 'Desc']],
      offset: (page - 1) * pageSize,
      limit: pageSize
    })

    const total = await UsersModel.count();
    return res.status(200).json({ msg: "success", total, data: users });
  }

  static async saveEntidad(body, id, logo = null) {
    try {
      return await sequelize.transaction(async (t) => {

        const keydata = await generateKeyWord()
        const postData = {
          nombre: body.nombreEntidad,
          sigla: body.sigla,
          tipo: body.tipoEntidad,
          descripcion: body.descripcion,
          idTipoNaturalezaJuridica: body.idTipoNaturalezaJuridica,
          logo,
          idUserResponsable: id,
          contactoNombre: body.nombre,
          contactoCorreo: body.email,
          contactoTelefono: body.telefono,
          direccion: body.direccion,
          urlDominio: body.urlDominio,
          urlFacebook: body.urlFacebook,
          urlTwitter: body.urlTwitter,
          urlLinkedin: body.urlLinkedin,
          keydata: await bcrypt.hash(keydata, 10),
          telefono: body.telefonoEntidad,
          email: body.emailEntidad
        }

        const entidad = await EntidadesModel.create(postData, { transaction: t });
        await registerKeyData(entidad.id, body.email.split('@')[0], keydata, 'E')
      })
    } catch (error) {
      throw (error);
    }
  }

  async getSelectUsers(req = request, res = response) {
    try {
      const users = await UsersModel.findAll({
        attributes: ['id', 'nombre'],
        include: [{
          model: EntidadesModel,
          as: 'entidad',
          attributes: ['id'],
          required: false
        }],
      })

      return res.status(200).json({ msg: "success", data: users.filter((e) => !e.entidad) });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, body, params } = req
        const { campo, keydata, value } = body;
        const id = params.idUser

        const validateKeyData = await validateKeyWord(id, 'U', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const updateData = {
          [campo]: value,
          updateBy: token?.id
        }
        if (campo == 'email') {
          updateData['registroValidado'] = 0;
          const codeTemp = await generateCodeTemporal();
          await UsersCTR.sendEmailValidate(model.email, model.nombre, codeTemp, model.id);
          await registerUserValidate(model.id, codeTemp);
        }

        await UsersModel.update(updateData, { where: { id } }, { transaction: t });

        return res.status(200).json({ msg: "success", data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateLogoUser(req = request, res = response) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body } = req
        const id = req.params.idUser
        const user = await UsersModel.findByPk(id);

        const validateKeyData = await validateKeyWord(id, 'U', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const fileToDelete = user?.logo;
        await user.update({
          logo: file ? file?.filename : null,
          updatedBy: token.id
        }, { transaction: t });

        if (fileToDelete) {
          deleteFile(fileToDelete, (err) => {
            if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
          })
        }
        return res.status(200).json({ msg: 'success', data: user });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateLogoEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }


}

module.exports = UsersCTR;