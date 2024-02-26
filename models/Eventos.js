const { DataTypes, Model } = require('sequelize');
const { urlFiles } = require('../config/config');

class EventosModel extends Model {
  static initialize(sequelizeInstace) {
    return super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
        },
        nombre: {
          type: DataTypes.STRING(120),
          field: 'nombre',
          allowNull: false,
        },
        descripcion: {
          type: DataTypes.STRING(250),
          field: 'descripcion',
          allowNull: false,
        },
        logo: {
          type: DataTypes.STRING(120),
          field: 'logo',
          allowNull: true,
        },
        idCiudad: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          field: 'id_ciudad',
          references: {
            model: 'ciudades',
            key: 'id'
          },
        },
        fechaInicio: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'fecha_inicio',
        },
        urlRegistro: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'url_registro',
        },
        precio: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          field: 'precio',
          allowNull: true,
          comment: "NULL = gratuito"
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 1,
          comment: "1=Pendiente, 2=Cancelado 3=Finalizado"
        },
        tipoResponsable: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo_responsable',
          allowNull: false,
          comment: "1=Socieda civil, 2=Empresa 3=Estado 4=Educativo"
        },
        urlLogo: {
          type: DataTypes.VIRTUAL,
          get() {
            const logo = this.getDataValue('logo');
            return logo ? `${urlFiles}${logo}` : null
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
        modelName: 'Eventos',
        tableName: 'eventos'
      },

    )
  }
}

//■► EXPORTAR:  ◄■:
module.exports = EventosModel;
