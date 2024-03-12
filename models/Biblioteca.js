const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');

class BibliotecaModel extends Model {
  static initialize(sequelizeInstace) {
    const Biblioteca = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
        },
        keydata: {
          type: DataTypes.STRING,
          allowNull: false
        },
        nombre: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'nombre',
        },
        descripcion: {
          type: DataTypes.STRING(250),
          allowNull: false,
          field: 'descripcion',
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
        autor: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'autor',
        },
        idRecursoMultimedia: {
          type: DataTypes.MEDIUMINT,
          allowNull: false,
          field: 'id_recurso_multimedia',
          references: {
            model: 'recursos_multimedia',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 1,
          comment: "0=inactivo 1=activo"
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
        modelName: 'Biblioteca',
        tableName: 'biblioteca',
        timestamps: false
      },
    );
    return Biblioteca;
  }
}

module.exports = BibliotecaModel;