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
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true
            },
            white: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
            },
            black: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            state: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            started: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ended: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            pun: {
                type: DataTypes.TEXT,
                allowNull: true,
            }
        }, { sequelize, modelName: 'Game', validate: {
            atLeastOnePlayer() {
                if (this.black === null && this.white === null) {
                    throw new Error("The game must have at least one player to start!")
                }
            }
        } })
    }
}