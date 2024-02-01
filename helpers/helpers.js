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
      default:
        register = false
        break;
    }
    if (!register) return false;
    return true;
  }
  //■► MET: Validar si un campo tiene un registro duplicado o ya existe un registro para ese valor ◄■:
  async validateFieldUnique(model, campo, value, id = null) {

  }
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();