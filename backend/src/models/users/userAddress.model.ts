import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserAddress extends Model {
    public addressId!: string;
    public userId!: string;
    public addressLine1!: string;
    public addressLine2!: string;
    public city!: string;
    public state!: string;
    public postalCode!: string;
    public country!: string;
    public isDefault!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
}
UserAddress.init({
    addressId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
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
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "userAddress",
    tableName: "userAddress",
    timestamps: true,
    paranoid: true
});

(UserAddress as any).associate = (models: any) => {
    UserAddress.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
};

export default UserAddress;