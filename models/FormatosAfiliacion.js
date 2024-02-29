const { DataTypes, Model } = require('sequelize');

class FormatosAfiliacionModel extends Model {
  static initialize(sequelizeInstace) {
    const Formatos = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
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
          comment: "0=inactivo 1=activo"
        },
        fechaInicioFormato: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'fecha_inicio_formato'
        },
        fechaFinFormato: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'fecha_fin_formato'
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
        modelName: 'FormatosAfiliacion',
        tableName: 'formatos_afiliacion'
      },

    )
    return Formatos;
  }
}

module.exports = FormatosAfiliacionModel;
