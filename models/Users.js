// ###################################################
// ######### MODELO: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');
// Add branch

//■► CLASE: Modelo Usuarios ◄■:
class UsersModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: DataTypes.STRING(40),
          allowNull: false
        },
        telefono: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING(30),
          unique: true,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        keydata: {
          type: DataTypes.STRING,
          allowNull: false
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
        modelName: 'Users',
        tableName: 'users'
      },

    )
  }
  static async findByEmail(email) {
    return await this.findOne({
      where: { email }, raw: true
    })
  }
}

//■► EXPORTAR:  ◄■:
module.exports = UsersModel;
