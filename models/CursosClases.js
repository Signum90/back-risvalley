const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');

class CursosClasesModel extends Model {
  static initialize(sequelizeInstace) {
    const CursosClases = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 1,
          comment: "1=Activo, 2=Inactivo"
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'nombre',
          unique: 'nombre'
        },
        descripcion: {
          type: DataTypes.STRING(250),
          allowNull: false,
          field: 'descripcion',
          unique: 'descripcion'
        },
        clase: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'clase',
        },
        urlClase: {
          type: DataTypes.VIRTUAL,
          get() {
            const clase = this.getDataValue('clase');
            return clase ? `${urlFiles}${clase}` : '/public/img/not_content/not_logo.png'
          }
        },
        idCursoSesion: {
          type: DataTypes.MEDIUMINT,
          allowNull: false,
          references: {
            model: 'cursos_sesiones',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_curso_sesion'
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
        modelName: 'CursosClases',
        tableName: 'cursos_clases'
      },

    )
    return CursosClases;
  }
}

module.exports = CursosClasesModel;
