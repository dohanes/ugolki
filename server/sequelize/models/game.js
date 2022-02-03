import { Model, DataTypes } from 'sequelize';

export default class Game extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            white: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: 'users',
                referencesKey: 'id'
            },
            black: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: 'users',
                referencesKey: 'id'
            },
            state: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            started: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            ended: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        }, { sequelize })
    }
}