// ###################################################
// ######### MODELO: ENTIDADES ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');

//■► CLASE: Modelo Usuarios ◄■:
class EntidadesModel extends Model {
  static initialize(sequelizeInstace) {
    const Entidades = super.init(
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
          unique: 'nombre'
        },
        sigla: {
          type: DataTypes.STRING(10),
          allowNull: true,
          field: 'sigla',
        },
        tipo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo',
          allowNull: false,
          comment: "1=Privada, 2=Pública 3=Mixta"
        },
        tipoEntidad: {
          type: DataTypes.VIRTUAL,
          get() {
            const types = { 1: 'Privada', 2: 'Pública', 3: 'Mixta' }
            const type = this.getDataValue('tipo');
            return types[type] ?? '';
          }
        },
        idTipoNaturalezaJuridica: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'x_tipos',
            key: 'id'
          },
          comment: "Tipo 1",
          field: 'id_tipo_naturaleza_juridica'
        },
        logo: {
          type: DataTypes.STRING(120),
          field: 'logo',
          allowNull: true,
        },
        contactoNombre: {
          type: DataTypes.STRING(70),
          allowNull: false,
          field: 'contacto_nombre',
        },
        contactoCargo: {
          type: DataTypes.STRING(70),
          allowNull: false,
          field: 'contacto_cargo',
        },
        contactoCorreo: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'contacto_correo',
        },
        contactoTelefono: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'contacto_telefono',
        },
        direccion: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'direccion',
        },
        urlDominio: {
          type: DataTypes.STRING(80),
          allowNull: true,
          field: 'url_dominio',
        },
        urlFacebook: {
          type: DataTypes.STRING(80),
          allowNull: true,
          field: 'url_facebook',
        },
        urlTwitter: {
          type: DataTypes.STRING(80),
          allowNull: true,
          field: 'url_twitter',
        },
        urlLinkedin: {
          type: DataTypes.STRING(80),
          allowNull: true,
          field: 'url_linkedin',
        },
        descripcion: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: 'descripcion',
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
        nombreServicio: {
          type: DataTypes.STRING(30),
          allowNull: false,
          field: 'nombre_servicio',
        },
        descripcionServicio: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'descripcion_servicio',
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
        modelName: 'Entidades',
        tableName: 'entidades'
      },

    )
    return Entidades;
  }
}

//RELACIONES

//■► EXPORTAR:  ◄■:
module.exports = EntidadesModel;
