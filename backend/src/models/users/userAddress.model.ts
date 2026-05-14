import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserAddress extends Model {
    public id!: number;
    public userId!: number;
    public addressLine1!: string;
    public addressLine2!: string;
    public city!: string;
    public state!: string;
    public postalCode!: string;
    public country!: string;
    public isDefault!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserAddress.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    addressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "userAddress",
    tableName: "userAddress"
});

(UserAddress as any).associate = (models: any) => {
    UserAddress.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
};

export default UserAddress;