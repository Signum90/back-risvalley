const { DataTypes, Model } = require('sequelize');
const UsersModel = require('./Users');
const { urlFiles } = require('../config/config');

class ServiciosTecnologicosModel extends Model {
  static initialize(sequelizeInstace) {
    const ServiciosTecnologicos = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
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
          comment: "0=inactivo 1=activo 2=pendiente aprobacion"
        },
        estadoLabel: {
          type: DataTypes.VIRTUAL,
          get() {
            const types = { 0:'inactivo', 1: 'activo', 2: 'Pendiente aprobacion' }
            const type = this.getDataValue('estado');
            return types[type] ?? '';
          }
        },
        idTipoServicio: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'x_tipos',
            key: 'id'
          },
          comment: "Tipo 2",
          field: 'id_tipo_servicio'
        },
        imagen: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'imagen',
          comment: "Archivo JPG JPEG PNG",
        },
        urlImagen: {
          type: DataTypes.VIRTUAL,
          get() {
            const img = this.getDataValue('imagen');
            return img ? `${urlFiles}${img}` : null
          }
        },
        idTipoClienteServicio: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'x_tipos',
            key: 'id'
          },
          comment: "Tipo 3",
          field: 'id_tipo_cliente_servicio'
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
        modelName: 'ServiciosTecnologicos',
        tableName: 'servicios_tecnologicos'
      },
    )
    ServiciosTecnologicos.belongsTo(UsersModel.initialize(sequelizeInstace), { foreignKey: 'created_by', as: 'contacto' });
    return ServiciosTecnologicos
  }
}

module.exports = ServiciosTecnologicosModel;