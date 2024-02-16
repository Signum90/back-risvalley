// ###################################################
// ######### MODELO: USUARIOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');
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
        tipo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo',
          allowNull: false,
          comment: "1=Socieda civil, 2=Empresa 3=Estado 4=Educativo"
        },
        superadmin: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'superadmin',
          allowNull: false,
          defaultValue: 0,
          comment: "1=si 0=no"
        },
        nombre: {
          type: DataTypes.STRING(40),
          field: 'nombre',
          allowNull: false,
        },
        cargo: {
          type: DataTypes.STRING(70),
          allowNull: false,
          field: 'cargo',
        },
        logo: {
          type: DataTypes.STRING(120),
          field: 'logo',
          allowNull: true,
        },
        urlLogo: {
          type: DataTypes.VIRTUAL,
          get() {
            const logo = this.getDataValue('logo');
            return logo ? `${urlFiles}${logo}` : null
          }
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
        sesionActiva: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'sesion_activa',
          allowNull: false,
          defaultValue: 0,
          comment: "1=si 0=no"
        },
        primerIngreso: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'primer_ingreso',
          allowNull: false,
          defaultValue: 0,
          comment: "1=si 0=no"
        },
        registroValidado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'registro_validado',
          allowNull: false,
          defaultValue: 0,
          comment: "0=no 1=si"
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
      where: { email }
    })
  }
}

//■► EXPORTAR:  ◄■:
module.exports = UsersModel;
