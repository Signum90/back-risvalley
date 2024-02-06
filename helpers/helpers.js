// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■:
const jwt = require('jsonwebtoken')
const config_db = require('../config/config');
const bcrypt = require('bcrypt')
const path = require('path');
const { sequelize } = require('../db/connection');
const fs = require('fs');
const crypto = require('node:crypto');
const KeyWordsModel = require('../models/KeyWords');
const EntidadesModel = require('../models/Entidades');
const EventosModel = require('../models/Eventos');
const { Op } = require('sequelize');
const CiudadesModel = require('../models/Ciudades');
const RecursosMultimediaModel = require('../models/RecursosMultimedia');
const RetosTecnologicosModel = require('../models/RetosTecnologicos');
const RetosAspirantesModel = require('../models/RetosAspirantes');
const UsersModel = require('../models/Users');

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
    return await keyRamdon
  }
  async registerKeyData(idRegistroAsociado, word, keydata, letter) {
    return await sequelize.transaction(async (t) => {
      const key = await bcrypt.hash(keydata, 10);
      await KeyWordsModel.create({
        key, idRegistroAsociado,
        word: letter + word
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
    let register = null
    switch (model) {
      case 'entidad':
        register = await EntidadesModel.findByPk(id);
        break;
      case 'evento':
        register = await EventosModel.findByPk(id);
        break;
      case 'ciudad':
        register = await CiudadesModel.findByPk(id);
        break;
      case 'reto':
        register = await RetosTecnologicosModel.findByPk(id);
        break;
      case 'retoAspirante':
        register = await RetosAspirantesModel.findByPk(id);
        break;
      case 'user':
        register = await UsersModel.findByPk(id)
        break;
      default:
        register = false
        break;
    }
    if (!register) return false;
    return true;
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
          'application/pdf': 3
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
      return await sequelize.transaction(async (t) => {
        const resource = await RecursosMultimediaModel.findByPk(id);
        const fileToDelete = resource?.recurso
        await resource.destroy({ transaction: t })
        return fileToDelete;
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