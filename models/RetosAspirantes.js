
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
                idReto: {
                    type: DataTypes.MEDIUMINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'retos_tecnologicos',
                        key: 'id'
                    },
                    onDelete: 'CASCADE',
                    field: 'id_reto'
                },
                idUserAspirante: {
                    type: DataTypes.MEDIUMINT.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onDelete: 'CASCADE',
                    field: 'id_user_aspirante'
                },
                fichaTecnica: {
                    type: DataTypes.STRING(120),
                    allowNull: false,
                    field: 'fichaTecnica',
                    comment: "Archivo PDF",
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
