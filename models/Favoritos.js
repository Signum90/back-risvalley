const { DataTypes, Model } = require('sequelize');
const ServiciosTecnologicosModel = require('./ServiciosTecnologicos');
const RetosTecnologicosModel = require('./RetosTecnologicos');
const CursosModel = require('./Cursos');
const BibliotecaModel = require('./Biblioteca');

class FavoritosModel extends Model {
  static initialize(sequelizeInstace) {
    const Favoritos = super.init(
      {
        id: {
          type: DataTypes.MEDIUMINT,
          primaryKey: true,
          autoIncrement: true
        },
        tipo: {
          type: DataTypes.TINYINT.UNSIGNED,
          field: 'tipo',
          allowNull: false,
          comment: "1=servicio 2=reto 3=curso 4=biblioteca"
        },
        idUser: {
          type: DataTypes.MEDIUMINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
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
        idBiblioteca: {
          type: DataTypes.MEDIUMINT,
          allowNull: true,
          references: {
            model: 'biblioteca',
            key: 'id'
          },
          onDelete: 'CASCADE',
          field: 'id_biblioteca'
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
        },
      },
      {
        sequelize: sequelizeInstace,
        modelName: 'Favoritos',
        tableName: 'favoritos',
        timestamps: false
      },
    )
    Favoritos.belongsTo(ServiciosTecnologicosModel.initialize(sequelizeInstace), { foreignKey: 'id_servicio', as: 'servicio' });
    Favoritos.belongsTo(RetosTecnologicosModel.initialize(sequelizeInstace), { foreignKey: 'id_reto', as: 'reto' });
    Favoritos.belongsTo(CursosModel.initialize(sequelizeInstace), { foreignKey: 'id_curso', as: 'curso' });
    Favoritos.belongsTo(BibliotecaModel.initialize(sequelizeInstace), { foreignKey: 'id_biblioteca', as: 'biblioteca' });

    return Favoritos;
  }
}

module.exports = FavoritosModel;
