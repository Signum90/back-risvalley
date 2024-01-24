// ###################################################
// ######### MODELO: PAISES ###################
// ###################################################
//■► PAQUETES EXTERNOS:  ◄■:
const { DataTypes, Model } = require('sequelize');


//■► CLASE: Modelo Usuarios ◄■:
class CiudadesModel extends Model {
    static initialize(sequelizeInstace) {
        return super.init(
            {
                id: {
                    type: DataTypes.MEDIUMINT.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true
                },
                nombre: {
                    type: DataTypes.STRING(25),
                    allowNull: false
                },
                idDepartamento: {
                    type: DataTypes.MEDIUMINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'departamentos',
                        key: 'id'
                    },
                    field: 'id_departamento'
                },
            },
            {
                sequelize: sequelizeInstace,
                modelName: 'Ciudad',
                timestamps: false,
                tableName: 'ciudades'
            },

        )
    }
}

//■► EXPORTAR:  ◄■:
module.exports = CiudadesModel;
