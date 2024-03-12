const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const { urlFiles } = require('../config/config');
const CursosModel = require('../models/Cursos');
const bcrypt = require('bcrypt');
const { registerKeyData, validateKeyWord, deleteFile, generateKeyWord } = require('../helpers/helpers');
const NotificacionesModel = require('../models/Notificaciones');

class CursosSesionesCTR {

}