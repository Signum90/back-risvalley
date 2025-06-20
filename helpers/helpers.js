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
const BibliotecaModel = require('../models/Biblioteca');
const NotificacionesModel = require('../models/Notificaciones');
const CursosModel = require('../models/Cursos');
const CursosEstudiantesModel = require('../models/CursosEstudiantes');
const FavoritosModel = require('../models/Favoritos');
const CursosSesionesModel = require('../models/CursosSesiones');
const CursosClasesModel = require('../models/CursosClases');

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
        'departamento': DepartamentosModel,
        'formato': FormatosModel,
        'pqr': PqrsModel,
        'archivo': BibliotecaModel,
        'curso': CursosModel,
        'notificacion': NotificacionesModel,
        'favorito': FavoritosModel,
        'sesion': CursosSesionesModel,
        'clase': CursosClasesModel,
        'estudiante': CursosEstudiantesModel
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

  async validateFieldUnique(model, condicion, id = null) {
    let exists = null
    const models = {
      'entidad': EntidadesModel,
      'retoAspirante': RetosAspirantesModel,
      'user': UsersModel,
      'cursoEstudiante': CursosEstudiantesModel,
      'favorito': FavoritosModel,
    }
    const condition = {
      ...(id ? { id: { [Op.not]: id } } : {}),
      ...condicion
    }
    exists = await models[model].findOne({ where: condition })
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
          'video/x-msvideo': 2,
          'video/x-matroska': 2,
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
      if (!bcrypt.compareSync(keyword?.key, keydata)) {
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

  async saveNotification(postData) {
    return await sequelize.transaction(async (t) => {
      await NotificacionesModel.create({ ...postData }, { transaction: t });
    })
  }
  response_handlers() {

  }
}
//■► EXPORTAR:  ◄■:
module.exports = new Helpers();