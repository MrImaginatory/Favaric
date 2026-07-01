import { DataTypes, Model } from "@sequelize/core";
import sqlite from "../../database/sqlite.js";
import { encryptData, decryptData } from "../../utils/crypto.util.js";

class UserSecurity extends Model {
    public userId!: string;
    public customSalt!: string;
    public pepper!: string;
    public deletedAt!: Date;
}
UserSecurity.init({
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
    },
    customSalt: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('customSalt');
            return rawValue ? decryptData(rawValue) : rawValue;
        },
        set(value: string) {
            this.setDataValue('customSalt', encryptData(value));
        }
    },
    pepper: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('pepper');
            return rawValue ? decryptData(rawValue) : rawValue;
        },
        set(value: string) {
            this.setDataValue('pepper', encryptData(value));
        }
    }
}, {
    sequelize: sqlite,
    tableName: 'user_security',
    modelName: 'UserSecurity',
});

export default UserSecurity;
