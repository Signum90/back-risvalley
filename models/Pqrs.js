const { DataTypes, Model } = require('sequelize');

class PqrsModel extends Model {
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
          comment: "1=Peticiones, 2=Quejas 3=Reclamos 4=Sugerencias"
        },
        tipoLabel: {
          type: DataTypes.VIRTUAL,
          get() {
            const types = {
              1: 'Peticiones',
              2: 'Quejas',
              3: 'Reclamos',
              4: 'Sugerencias',
              5: 'contacto',
              6: 'solicitud',
              7: 'denuncia'
            }

            const tipo = this.getDataValue('tipo');
            return types[tipo] ?? null;
          }
        },
        pqr: {
          type: DataTypes.STRING(250),
          allowNull: false,
          field: 'pqr',
        },
        userActivo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'user_activo',
          allowNull: false,
          comment: "0=no 1=si"
        },
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 1,
          comment: "1=Pendiente, 2=En proceso 3=Finalizado"
        },
        estadoLabel: {
          type: DataTypes.VIRTUAL,
          get() {
            const types = {
              1: 'Pendiente',
              2: 'En proceso',
              3: 'Finalizado',
            }

            const state = this.getDataValue('estado');
            return types[state] ?? null;
          }
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
        imagenSoporte: {
          type: DataTypes.STRING(120),
          allowNull: true,
          field: 'imagen_soporte',
        },
        soporte: {
          type: DataTypes.STRING(150),
          allowNull: true,
          field: 'soporte',
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
        modelName: 'Pqrs',
        tableName: 'pqrs'
      })
  }
}

module.exports = PqrsModel;