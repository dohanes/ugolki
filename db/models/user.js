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
                type: DataTypes.STRING(16),
                allowNull: false,
                unique: 'usernameIndex',
                validate: {
                    isAlphanumeric: {
                        args: true,
                        msg: "Your username must be alphanumeric!"
                    },
                    notEmpty: {
                        args: true,
                        msg: "Your username cannot be empty!"
                    },
                    len: {
                        args: [3, 16],
                        msg: "Your username must be between 3 to 16 characters!"
                    }
                }
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        }, { sequelize, modelName: 'User' } )
    }
}