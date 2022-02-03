import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
    static init(sequelize) {
        super.init({
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
        }, { sequelize } )
    }
}