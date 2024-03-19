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
        estado: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'estado',
          allowNull: false,
          defaultValue: 0,
          comment: "0=sin leer 1=leido"
        },
        idUser: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'NO ACTION',
          comment: "NULL=notificaciones superadmin",
          field: 'id_user'
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
        idPqr: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'pqrs',
            key: 'id',
          },
          onDelete: 'CASCADE',
          field: 'id_pqr'
        },
        idReto: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'retos_tecnologicos',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_reto'
        },
        idRetoAspirante: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'retos_aspirantes',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_reto_aspirante'
        },
        idCurso: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: true,
          references: {
            model: 'cursos',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_curso'
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
        tipo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo',
          allowNull: false,
          comment: "10*s=*SERVICIOS* 11=contacto 12=aprobado 13=pendiente aprobacion 20*s=*RETOS TECNOLOGICOS* 21=postulacion 22=aprobado 23=pendiente aprobacion 24=correpcion 30*s=*CURSOS* 31=inscripcion 32=aprobado 33=pendiente aprobación 40*PQRS* 41=Nueva 42=resuelto 50*EVENTOS*  51=pendiente aprobacion 52=aprobado"
        },
        tipoLabel: {
          type: DataTypes.VIRTUAL,
          get() {
            const tipo = this.getDataValue('tipo');
            let tipoLabel = null;
            switch (tipo) {
              case 11:
              case 12:
              case 13:
                tipoLabel = 'Servicio';
                break;
              case 21:
              case 22:
              case 23:
              case 24:
                tipoLabel = 'Reto';
                break;
              case 31:
              case 32:
              case 33:
                tipoLabel = 'Curso';
                break;
              case 41:
              case 42:
                tipoLabel = 'Pqrs';
                break;
              case 51:
              case 52:
              case 53:
                tipoLabel = 'Evento';
                break;
              default:
                tipoLabel = '';
                break;
            }
            return tipoLabel;
          }
        },
        contactoNombre: {
          type: DataTypes.STRING(70),
          allowNull: true,
          field: 'contacto_nombre',
        },
        contactoCorreo: {
          type: DataTypes.STRING(80),
          allowNull: true,
          field: 'contacto_correo',
        },
        contactoTelefono: {
          type: DataTypes.BIGINT,
          allowNull: true,
          field: 'contacto_telefono',
        },
        userActivo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'user_activo',
          allowNull: false,
          comment: "0=no 1=si"
        },
        comentario: {
          type: DataTypes.STRING(70),
          allowNull: true,
          field: 'comentario',
        },
        notificacion: {
          type: DataTypes.VIRTUAL,
          get() {
            const nombre = this.getDataValue('contactoNombre');
            const correo = this.getDataValue('contactoCorreo');
            const telefono = this.getDataValue('contactoTelefono');
            const states = {
              11: `${nombre} esta interesado en este servicio, puedes contactar con el a traves del siguiente correo electronico ${correo} o al siguiente telefono: ${telefono}`,
              12: `Tu servicio ha sido aceptado por nuestro administrador.`,
              13: `Se ha postulado un nuevo servicio para revisión.`,
              21: `${nombre} se postulo a tu reto, puedes contactar con el a traves del siguiente correo electronico ${correo} o al siguiente telefono ${telefono}`,
              22: `Tu reto tecnologico ha sido aceptado por nuestro administrador.`,
              23: `Te informamos que se ha postulado un nuevo reto tecnologico para revisión.`,
              24: `${nombre} ha revisado con atención tu solicitud para participar en nuestro reto tecnologico y quisiera solicitarte algunas mejoras:`, //pendiente
              31: `${nombre} se ha matriculado en tu curso, puedes contactar con el a traves del siguiente correo electronico ${correo} o al siguiente telefono: ${telefono}`,
              32: `Tu curso ha sido aceptado por nuestro administrador. ya puedes crear modulos y subir contenido para el curso`,
              33: `Te informamos que se ha postulado un nuevo curso para revisión.`,
              41: `Se ha recibido una nueva PQR.`,
              42: `¡Respuesta recibida! Revisa la respuesta del administrador a tu PQR`,
              51: `Te informamos que se ha postulado un nuevo evento para revisión`,
              52: `Tu evento ha sido aceptado por nuestro administrador`,
            }
            const state = this.getDataValue('tipo');
            return states[state] ?? '';
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