const { DataTypes, Model } = require('sequelize');

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
          comment: "1=Activo, 2=Inactivo 3=Pendiente aprobacion"
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'nombre',
          unique: 'nombre'
        },
        imagen: {
          type: DataTypes.STRING(120),
          field: 'imagen',
          allowNull: true,
        },
        vistaPrevia: {
          type: DataTypes.STRING(120),
          field: 'vista_previa',
          allowNull: true,
        },
        descripcion: {
          type: DataTypes.STRING(250),
          allowNull: false,
          field: 'descripcion',
          unique: 'descripcion'
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