const { DataTypes, Model } = require('sequelize');

class FavoritosModel extends Model {
  static initialize(sequelizeInstace) {
    const Favoritos = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
        },
        idUser: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          field: 'created_by'
        },
        idServicio: {
          type: DataTypes.MEDIUMINT,
          allowNull: true,
          references: {
            model: 'servicios_tecnologicos',
            key: 'id',
          },
          onDelete: 'CASCADE',
          field: 'id_servicio'
        },
        idEvento: {
          type: DataTypes.MEDIUMINT,
          allowNull: true,
          references: {
            model: 'eventos',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_evento'
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
        modelName: 'Favoritos',
        tableName: 'favoritos',
        timestamps: false
      },

    )
    return Favoritos;
  }
}

module.exports = FavoritosModel;
