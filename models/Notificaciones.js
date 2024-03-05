const { DataTypes, Model } = require('sequelize');

class NotificacionesModel extends Model {
  static initialize(sequelizeInstace) {
    const Notificaciones = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
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
        contactoNombre: {
          type: DataTypes.STRING(70),
          allowNull: false,
          field: 'contacto_nombre',
        },
        contactoCorreo: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'contacto_correo',
        },
        contactoTelefono: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: 'contacto_telefono',
        },
        userActivo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'user_activo',
          allowNull: false,
          comment: "0=no 1=si"
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
        }
      },
      {
        sequelize: sequelizeInstace,
        modelName: 'Notificaciones',
        tableName: 'notificaciones',
        timestamps: false
      },
    );
    return Notificaciones;
  }
}

module.exports = NotificacionesModel;