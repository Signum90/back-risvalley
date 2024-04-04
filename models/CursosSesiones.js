const { DataTypes, Model } = require('sequelize');
const CursosClasesModel = require('./CursosClases');

class CursosSesionesModel extends Model {
  static initialize(sequelizeInstace) {
    const CursosSesiones = super.init(
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
          comment: "1=Activo, 0=Inactivo"
        },
        nombre: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'nombre',
        },
        idCurso: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'cursos',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_curso'
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
        modelName: 'CursosSesiones',
        tableName: 'cursos_sesiones'
      },
    )
    CursosSesiones.hasMany(CursosClasesModel.initialize(sequelizeInstace), { foreignKey: 'id_curso_sesion', as: 'clases' });
    return CursosSesiones;
  }
}

module.exports = CursosSesionesModel;
