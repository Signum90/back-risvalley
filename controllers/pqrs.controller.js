const { sequelize } = require('../db/connection');
const { literal } = require('sequelize');
const PqrsModel = require('../models/Pqrs');
const UsersModel = require('../models/Users');
const { urlFiles } = require('../config/config');

class PqrsCTR {
  async getPQRS(req, res) {
    const pqrs = await PqrsModel.findAll({
      attributes: [
        'id',
        'pqr',
        'created_by',
        'userActivo',
        'estado',
        'contactoNombre',
        'contactoCorreo',
        'contactoTelefono',
        'soporte',
        [literal(`(SELECT CONCAT('${urlFiles}', imagen_soporte))`), 'urlImagenSoporte'],
      ],
      order: [['estado', 'Asc']],
    })

    return res.status(200).json({ msg: 'success', data: pqrs });
  }

  async postPQRS(req, res) {
    return await sequelize.transaction(async (t) => {
      const { body, token } = req;
      let contactoNombre
      let contactoCorreo
      let contactoTelefono
      let userActivo
      if (token) {
        const user = await UsersModel.findByPk(token.id)
        userActivo = 1
        contactoNombre = user.nombre
        contactoCorreo = user.email
        contactoTelefono = user.telefono
      } else {
        userActivo = 0
        contactoNombre = body.nombre
        contactoCorreo = body.email
        contactoTelefono = body.telefono
      }

      const postData = {
        tipo: body.tipo,
        pqr: body.pqr,
        createdBy: token ? token.id : null,
        userActivo,
        contactoNombre,
        contactoCorreo,
        contactoTelefono,
      }

      const model = await PqrsModel.create(postData, { transaction: t })
      return res.status(200).json({ msg: 'success', data: model });
    })
  }

  async resolvePQR(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { body, token, file, params } = req
        const id = params.idPqr

        const editData = {
          soporte: body.soporte,
          imagenSoporte: file ? file?.filename : null,
          estado: 3,
          updatedBy: token.id
        }
        await PqrsModel.update(editData, { where: { id } })
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PqrsCTR;