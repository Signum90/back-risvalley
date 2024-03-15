const { sequelize } = require('../db/connection');
const { literal, Op } = require('sequelize');
const { urlFiles } = require('../config/config');
const BibliotecaModel = require('../models/Biblioteca');
const { saveResourceMultimedia, deleteResourceMultimedia, deleteFile, generateKeyWord, registerKeyData, validateKeyWord } = require('../helpers/helpers');
const bcrypt = require('bcrypt')

class BibliotecaController {
  async getFilesLibrary(req, res) {
    try {
      const { token } = req
      const { page, nombre, autor, idsCategorias } = req.query
      const paginate = page ?? 1;
      const pageSize = 10;

      const files = await BibliotecaModel.findAll({
        attributes: [
          'id',
          'estado',
          'nombre',
          'autor',
          'descripcion',
          'imagen',
          'urlImagen',
          'keydata',
          'urlImagen',
          'idTipoCategoria',
          'tipo',
          'tipoLabel',
          'createdAt',
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
          [literal(`(SELECT x.nombre FROM x_tipos AS x WHERE x.id = idTipoCategoria)`), 'categoria'],
        ],
        where: {
          ...(token ? {} : { estado: 1 }),
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(autor ? { autor: { [Op.like]: `%${autor}%` } } : {}),
          ...(idsCategorias ? { idCategoria: { [Op.in]: idsCategorias } } : {})
        },
        order: [['createdAt', 'Desc']],
        offset: (paginate - 1) * pageSize,
        limit: pageSize
      })

      const count = await BibliotecaModel.count({
        where: {
          ...(token ? {} : { estado: 1 }),
          ...(nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {}),
          ...(autor ? { autor: { [Op.like]: `%${autor}%` } } : {}),
          ...(idsCategorias ? { idCategoria: { [Op.in]: idsCategorias } } : {})
        },
      })

      return res.status(200).json({ data: files, total: count });

    } catch (error) {
      throw error;
    }
  }

  async getDetailFile(req, res) {
    try {
      const id = req.params.idArchivo;
      const file = await BibliotecaModel.findOne({
        attributes: [
          'id',
          'estado',
          'nombre',
          'autor',
          'descripcion',
          'imagen',
          'urlImagen',
          'keydata',
          'urlImagen',
          'createdAt',
          [literal(`(SELECT CONCAT('${urlFiles}', rm.recurso) FROM recursos_multimedia AS rm WHERE rm.id = id_recurso_multimedia)`), 'recursoMultimedia'],
        ],
        where: { id },
      })

      return res.status(200).json({ msg: 'success', data: file });
    } catch (error) {
      throw error;
    }
  }

  async postFileLibrary(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { files, token, body } = req;
        const { nombre, descripcion, autor } = body;

        const imagen = files['imagen'][0];
        const libro = files['libro'][0];

        const recursoMultimediaRegistro = await saveResourceMultimedia(libro, token?.id);
        const keydata = await generateKeyWord();

        const model = await BibliotecaModel.create({
          idRecursoMultimedia: recursoMultimediaRegistro.id,
          idTipoCategoria: body.idCategoria,
          tipo: body.tipo,
          estado: 1,
          imagen: imagen?.filename,
          keydata: await bcrypt.hash(keydata, 10),
          nombre,
          descripcion,
          autor,
          createdBy: token.id
        }, { transaction: t })

        await registerKeyData(model.id, recursoMultimediaRegistro.recurso, keydata, 'BI');

        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      throw error;
    }
  }

  async changeStateFile(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { token, params, body } = req;
        const file = await BibliotecaModel.findByPk(params.idArchivo);

        const validateKeyData = await validateKeyWord(params.idArchivo, 'BI', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const updateData = {
          estado: file.estado ? 0 : 1,
          updatedBy: token.id
        }

        await file.update(updateData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: file });
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFileLibrary(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params, query } = req;

        const file = await BibliotecaModel.findByPk(params.idArchivo);
        const validateKeyData = await validateKeyWord(params.idArchivo, 'BI', query.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const multimediaFile = await deleteResourceMultimedia(file.idRecursoMultimedia);

        deleteFile(multimediaFile, (err) => {
          if (err) console.log("🚀 ~ EntidadesCTR ~ deleteFile ~ err:", err)
        });

        await file.destroy({ transaction: t });
        return res.status(200).json({ msg: 'success', data: true });
      })
    } catch (error) {
      throw error;
    }
  }

  async updateFieldsFile(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { params, token, body, file } = req;
        const { keydata, campo, value } = body;

        const model = await BibliotecaModel.findByPk(params.idArchivo);
        const validateKeyData = await validateKeyWord(params.idArchivo, 'BI', keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const updateData = {
          [campo]: campo == 'imagen' ? file.filename : value,
          updatedBy: token.id
        }
        //return res.status(200).json({ msg: 'success', data: updateData });
        await model.update(updateData, { transaction: t });

        return res.status(200).json({ msg: 'success', data: model });
      })


    } catch (error) {
      throw error
    }
  }

  async updateFile(req, res) {
    try {
      return await sequelize.transaction(async (t) => {
        const { file, token, body, params } = req

        const model = await BibliotecaModel.findByPk(params.idArchivo);
        const validateKeyData = await validateKeyWord(params.idArchivo, 'BI', body.keydata);
        if (!validateKeyData) return res.status(400).json({ type: 'error', msg: 'El identificador no concuerda con ningún usuario registrado', status: 400 });

        const idFileToDelete = model?.idRecursoMultimedia;
        const recursoMultimediaRegistro = await saveResourceMultimedia(file, token?.id);


        await model.update({
          idRecursoMultimedia: recursoMultimediaRegistro.id,
          updatedBy: token.id
        }, { transaction: t });

        //const fileToDelete = await deleteResourceMultimedia(idFileToDelete);

        //if (fileToDelete) {
        //  deleteFile(fileToDelete, (err) => {
        //    if (err) console.log("🚀 ~ EventosCTR ~ deleteFile ~ err:", err)
        //  })
        //}
        return res.status(200).json({ msg: 'success', data: model });
      })
    } catch (error) {
      console.log("🚀 ~ EventosCTR ~ updateLogoEvent ~ error:", error)
      return res.status(400).json({ error })
    }
  }

}

module.exports = BibliotecaController;