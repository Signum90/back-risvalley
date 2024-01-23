// #########################################
// ############### HELPERS #################
// #########################################
//■► PAQUETES EXTERNOS:  ◄■:
const jwt = require('jsonwebtoken')
const config_db = require('../config/config');
const bcrypt = require('bcrypt')
const { sequelize } = require('../db/connection');
const crypto = require('node:crypto');
const KeyWordsModel = require('../models/KeyWords');

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
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();