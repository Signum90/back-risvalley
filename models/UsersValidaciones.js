const { DataTypes, Model } = require('sequelize');

class UsersValidacionesModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        idUser: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          comment: "User",
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          field: 'id_user'
        },
        codigoTemporal: {
          type: DataTypes.STRING(40),
          allowNull: false,
          field: 'codigo_temporal',
          unique: 'codigo_temporal'
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
        modelName: 'UsersValidaciones',
        tableName: 'users_validaciones',
        timestamps: false
      })
  }
}

module.exports = UsersValidacionesModel;