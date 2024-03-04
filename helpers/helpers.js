// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■:
const jwt = require('jsonwebtoken')
const config_db = require('../config/config');
const bcrypt = require('bcrypt')
const path = require('path');
const { Op } = require('sequelize');
const { sequelize } = require('../db/connection');
const { emailTransport } = require('../config/email');
const fs = require('fs');
const crypto = require('node:crypto');
const KeyWordsModel = require('../models/KeyWords');
const EntidadesModel = require('../models/Entidades');
const EventosModel = require('../models/Eventos');
const CiudadesModel = require('../models/Ciudades');
const RecursosMultimediaModel = require('../models/RecursosMultimedia');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const RetosAspirantesModel = require('../models/RetosAspirantes');
const UsersModel = require('../models/Users');
const usersValidacionesModel = require('../models/UsersValidaciones');
const UsersValidacionesModel = require('../models/UsersValidaciones');
const XTipoModel = require('../models/XTipos');
const ServiciosTecnologicosModel = require('../models/ServiciosTecnologicos');
const DepartamentosModel = require('../models/Departamentos');
const FormatosModel = require('../models/Formatos');
const PqrsModel = require('../models/Pqrs');

//■► CLASE: Helpers de Datos ◄■:
class Helpers {
  generarJWT(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.SECRETKEYJWT, {
        expiresIn: '1d'
      }, (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el token')
        } else {
          resolve(token);
        }
      })
    })
  }
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, config_db.secret)
      return decoded
    } catch (e) {
      return false
    }
  }
  async generateKeyWord() {
    const keyRamdon = await crypto.randomBytes(16).toString('hex');
    return keyRamdon
  }
  async generatePasswordTemporal() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var stringLength = 12;
    var randomstring = '';
    for (var i = 0; i < stringLength; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }
  async registerKeyData(idRegistroAsociado, word, key, letter) {
    return await sequelize.transaction(async (t) => {
      //const key = await bcrypt.hash(keydata, 10);
      await KeyWordsModel.create({
        key, idRegistroAsociado,
        word: letter + '-' + word
      }, { transaction: t });
    })
  }
  deleteFile(fileName, callback) {
    const rutaArchivo = path.join('public/files', fileName);
    fs.unlink(rutaArchivo, (err) => {
      if (err) {
        callback(err);
        return;
      }
      console.log('Archivo eliminado correctamente');
      callback(null);
    });
  }
  async validateExistId(model, id) {
    try {
      const models = {
        'entidad': EntidadesModel,
        'evento': EventosModel,
        'servicio': ServiciosTecnologicosModel,
        'ciudad': CiudadesModel,
        'reto': RetosTecnologicosModel,
        'retoAspirante': RetosAspirantesModel,
        'user': UsersModel,
        'tipo': XTipoModel,
        'servicio': ServiciosTecnologicosModel,
        'departamento': DepartamentosModel,
        'formato': FormatosModel,
        'pqr': PqrsModel
      }
      if (!models[model]) return false;
      const register = await models[model].findByPk(id);
      if (!register) return false;
      return true;
    } catch (error) {
      console.log("🚀 ~ Helpers ~ validateExistId ~ error:", error)
      throw error;
    }
  }
  //■► MET: Validar si un campo tiene un registro duplicado o ya existe un registro para ese valor ◄■:
  async validateFieldUnique(model, campo, value, id = null, campo2 = null, value2 = null) {
    let exists = null
    const condition = {
      [campo]: value,
      ...(id ? { id: { [Op.not]: id } } : {}),
      ...(campo2 && value2 ? { [campo2]: value2 } : {})
    }
    switch (model) {
      case 'entidad':
        exists = await EntidadesModel.findOne({ where: condition })
        break;
      case 'retoAspirante':
        exists = await RetosAspirantesModel.findOne({ where: condition })
        break;
      case 'user':
        exists = await UsersModel.findOne({ where: condition })
        break;
      default:
        exists = false;
        break;
    }
    if (!exists) return false;
    return true;
  }

  async saveResourceMultimedia(file, createdBy) {
    try {
      return await sequelize.transaction(async (t) => {
        const types = {
          'image/png': 1,
          'image/jpeg': 1,
          'video/mp4': 2,
          'video/mpeg': 2,
          'application/pdf': 3,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 4,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 5
        }
        const model = await RecursosMultimediaModel.create(
          {
            recurso: file?.filename,
            tipo: types[file?.mimetype],
            createdBy
          }, { transaction: t })
        return model;
      })
    } catch (e) {
      throw e;
    }
  }

  //■► MET: Elimina un registro de la tabla recursos multimedia y retorna el nombre del archivo eliminado ◄■:
  async deleteResourceMultimedia(id) {
    try {
      return await sequelize.transaction(async (tr) => {
        const resource = await RecursosMultimediaModel.findByPk(id);
        const fileToDelete = resource?.recurso
        await resource.destroy({ transaction: tr })
        return fileToDelete;
      })
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(email) {
    try {
      email['from'] = config_db.email.from
      await emailTransport.sendMail(email);
      return true;
    } catch (error) {
      console.log("🚀 ~ Helpers ~ sendEmail ~ error:", error)
    }
  }

  async generateCodeTemporal() {
    const codigoTemporal = Math.random().toString().substring(2, 8);
    const codeRegister = await usersValidacionesModel.findOne({ where: { codigoTemporal } })
    if (codeRegister) Helpers.generateCodeTemporal();
    return codigoTemporal;
  }

  async registerUserValidate(idUser, codigoTemporal) {
    try {
      return await sequelize.transaction(async (t) => {
        await UsersValidacionesModel.create({
          idUser,
          codigoTemporal
        }, { transaction: t });
      })
    } catch (error) {
      throw error;
    }
  }

  async validateKeyWord(id, letter, keydata) {
    try {
      const keyword = await KeyWordsModel.findOne({
        where: {
          word: { [Op.like]: `${letter}%` },
          idRegistroAsociado: id
        }
      })
      if (!bcrypt.compareSync(keyword.key, keydata)) {
        return false;
      }
      return keyword;
    } catch (error) {
      throw error;
    }
  }

  async deleteKeyWord(id) {
    try {
      return await sequelize.transaction(async (t) => {
        await KeyWordsModel.destroy({ where: { id } }, { transaction: t })
      })
    } catch (error) {
      throw error;
    }
  }
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();