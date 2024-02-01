const { DataTypes, Model } = require('sequelize');

class RetosTecnologicosModel extends Model {
    static initialize(sequelizeInstace) {
        const RetosTecnologicos = super.init(
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
                },
                descripcion: {
                    type: DataTypes.STRING(150),
                    allowNull: false,
                    field: 'descripcion',
                },
                fechaInicio: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                    field: 'fechaInicio'
                },
                fechaFin: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                    field: 'fechaFin'
                },
                fichaTecnica: {
                    type: DataTypes.STRING(120),
                    allowNull: false,
                    field: 'fichaTecnica',
                    comment: "Archivo PDF",
                },
                idRecursoMultimedia: {
                    type: DataTypes.STRING(120),
                    allowNull: false,
                    field: 'id_recurso_multimedia',
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
                modelName: 'RetosTecnologicos',
                tableName: 'retos_tecnologicos'
            },

        )
        return RetosTecnologicos;
    }
}

//■► EXPORTAR:  ◄■:
module.exports = RetosTecnologicosModel;
