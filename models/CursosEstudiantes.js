const { DataTypes, Model } = require('sequelize');

class CursosEstudiantesModel extends Model {
  static initialize(sequelizeInstace) {
    const CursosEstudiantes = super.init(
      {
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
        idUser: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_user'
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          comment: "1=Activo, 2=Inactivo"
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW,
          field: 'created_at'
        },
      },
      {
        sequelize: sequelizeInstace,
        modelName: 'CursosEstudiantes',
        tableName: 'cursos_estudiantes',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['id_curso', 'id_user'],
          },
        ],
      },
    )
    return CursosEstudiantes;
  }
}

module.exports = CursosEstudiantesModel;