// ###################################################
// ######### MODELO: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■: 
const { DataTypes, Model } = require('sequelize');
// Add branch

//■► CLASE: Modelo Usuarios ◄■: 
class UsersModel extends Model {
  static initialize(sequelizeInstace){
    return super.init(
      {
        id:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: DataTypes.STRING,
          allowNull: false
        },
        telefono:{
          type: DataTypes.INTEGER,
          allowNull: true
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        keydata:{
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize: sequelizeInstace,
        modelName: 'Users'
      },

    )
  }
  static findByEmail(){
    
  }
}
// Relacionamiento
// UsersModel.hasMany(require('./Posts'), { foreignKey: 'userId' });

//■► EXPORTAR:  ◄■: 
module.exports = UsersModel;
