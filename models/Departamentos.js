const { DataTypes, Model } = require('sequelize');

class DepartamentosModel extends Model {
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
            },
            {
                sequelize: sequelizeInstace,
                modelName: 'Departamentos',
                timestamps: false,
                tableName: 'departamentos'
            },

        )
    }
}

//■► EXPORTAR:  ◄■:
module.exports = DepartamentosModel;