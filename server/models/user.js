import { DataTypes } from 'sequelize';

export default sequelize => {
    sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(48),
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    })
}