import { DataTypes } from 'sequelize';

export default sequelize => {
    sequelize.define('Game', {
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
    })
}