
const { DataTypes, Model } = require('sequelize');

class RetosAspirantesModel extends Model {
    static initialize(sequelizeInstace) {
        const RetosAspirantes = super.init(
            {
                id: {
                    type: DataTypes.MEDIUMINT,
                    primaryKey: true,
                    autoIncrement: true
                },
                recurso: {
                    type: DataTypes.STRING(120),
                    allowNull: false,
                    field: 'recurso',
                },
                tipo: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    field: 'tipo',
                    allowNull: false,
                    comment: "1=imagen, 2=video 3=pdf"
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
                modelName: 'RetosAspirantes',
                tableName: 'retos_aspirantes',
                timestamps: false,
            },

        )
        return RetosAspirantes;
    }
}

//RELACIONES

//■► EXPORTAR:  ◄■:
module.exports = RetosAspirantesModel;
