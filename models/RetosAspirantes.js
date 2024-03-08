
const { DataTypes, Model } = require('sequelize');
const UsersModel = require('./Users');
const { urlFiles } = require('../config/config');
const RetosTecnologicosModel = require('./RetosTecnologicos');

class RetosAspirantesModel extends Model {
  static initialize(sequelizeInstace) {
    const RetosAspirantes = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        idReto: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'retos_tecnologicos',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_reto'
        },
        idUserAspirante: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_user_aspirante'
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
        modelName: 'RetosAspirantes',
        tableName: 'retos_aspirantes',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['id_reto', 'id_user_aspirante'],
          },
        ],
      },
    )
    RetosAspirantes.belongsTo(UsersModel.initialize(sequelizeInstace), { foreignKey: 'id_user_aspirante', as: 'aspirante' });
    return RetosAspirantes;
  }
}

//RELACIONES

//■► EXPORTAR:  ◄■:
module.exports = RetosAspirantesModel;
