// ###################################################
// ######### MODELO: KEYWORDS ###################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');

class KeyWordsModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        word: {
          type: DataTypes.STRING(),
          allowNull: false,
          field: 'word'
        },
        key: {
          type: DataTypes.STRING(),
          allowNull: false,
          field: 'key'
        },
        idRegistroAsociado: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          field: 'id_registro_asociado'
        },
        createdBy: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          comment: "User",
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
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
        timestamps: false,
        modelName: 'keywords',
        tableName: 'keywords',
        indexes: [
          {
            unique: true,
            fields: ['key', 'word'],
          },
        ],
      },
    )
  }
}

//■► EXPORTAR:  ◄■:
module.exports = KeyWordsModel;
