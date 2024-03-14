// ###################################################
// ######### MODELO: XTIPOS ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');


//■► CLASE: Modelo Usuarios ◄■:
class XTipoModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: DataTypes.STRING(70),
          allowNull: false,
          field: 'nombre',
        },
        descripcion: {
          type: DataTypes.STRING(120),
          allowNull: true,
          field: 'descripcion',
        },
        imagen: {
          type: DataTypes.STRING(120),
          field: 'imagen',
          allowNull: true,
        },
        urlImagen: {
          type: DataTypes.VIRTUAL,
          get() {
            const logo = this.getDataValue('imagen');
            return logo ? `${urlFiles}${logo}` : '/public/img/not_content/not_logo.png'
          }
        },
        clasificacion: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'clasificacion',
          allowNull: false,
          comment: "1=tipo naturaleza juridica, 2=Tipo de servicio 3=Tipo de clientes de servicio 4=Categorias"
        },
        createdBy: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          comment: "User",
          references: {
            model: 'users',
            key: 'id'
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
        modelName: 'x_tipos',
        tableName: 'x_tipos'
      },

    )
  }
}

//■► EXPORTAR:  ◄■:
module.exports = XTipoModel;
