const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');

class RetosTecnologicosModel extends Model {
  static initialize(sequelizeInstace) {
    const RetosTecnologicos = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'nombre',
        },
        descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: 'descripcion',
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 1,
          comment: "1=Pendiente, 2=Convocatoria abierta 3=finalizado"
        },
        fechaInicioConvocatoria: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'fecha_inicio_convocatoria'
        },
        fechaFinConvocatoria: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'fecha_fin_convocatoria'
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
            return ficha ? `${urlFiles}${ficha}` : null
          }
        },
        estadoLabel: {
          type: DataTypes.VIRTUAL,
          get() {
            const types = { 1: 'Pendiente', 2: 'Convocatoria abierta', 3: 'Finalizado' }
            const type = this.getDataValue('estado');
            return types[type] ?? '';
          }
        },
        idRecursoMultimedia: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'id_recurso_multimedia',
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
        modelName: 'RetosTecnologicos',
        tableName: 'retos_tecnologicos'
      },

    )
    return RetosTecnologicos;
  }
}

//■► EXPORTAR:  ◄■:
module.exports = RetosTecnologicosModel;
