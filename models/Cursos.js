const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');

class CursosModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          comment: "0= inactivo 1=Activo, 2=Pendiente aprobacion"
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'nombre'
        },
        imagen: {
          type: DataTypes.STRING(120),
          field: 'imagen',
          allowNull: true,
        },
        urlImagen: {
          type: DataTypes.VIRTUAL,
          get() {
            const img = this.getDataValue('imagen');
            return img ? `${urlFiles}${img}` : '/public/img/not_content/not_logo.png'
          }
        },
        fichaTecnica: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'ficha_tecnica',
          comment: "Archivo PDF",
        },
        urlFichaTecnica: {
          type: DataTypes.VIRTUAL,
          get() {
            const ficha = this.getDataValue('fichaTecnica');
            return ficha ? `${urlFiles}${ficha}` : '/public/img/not_content/not_logo.png'
          }
        },
        descripcion: {
          type: DataTypes.STRING(250),
          allowNull: false,
          field: 'descripcion',
          unique: 'descripcion'
        },
        idUserResponsable: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          comment: "User",
          references: {
            model: 'users',
            key: 'id',
          },
          field: 'id_user_responsable',
          unique: 'id_user_responsable'
        },
        keydata: {
          type: DataTypes.STRING,
          allowNull: false
        },
        createdBy: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          comment: "User",
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'NO ACTION',
          field: 'created_by'
        },
        updatedBy: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'NO ACTION',
          field: 'updated_by'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
          field: 'updated_at'
        },
      },
      {
        sequelize: sequelizeInstace,
        modelName: 'Cursos',
        tableName: 'cursos'
      })
  }
}

module.exports = CursosModel;