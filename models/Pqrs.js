const { DataTypes, Model } = require('sequelize');

class PqrsModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        tipo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo',
          allowNull: false,
          comment: "1=Peticiones, 2=Quejas 3=Reclamos 4=Sugerencias"
        },
        pqr: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: 'pqr',
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
        modelName: 'Pqrs',
        tableName: 'pqrs'
      })
  }
}

module.exports = PqrsModel;