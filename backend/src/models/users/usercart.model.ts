import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserCart extends Model {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserCart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "userCart",
    tableName: "userCart"
});

(UserCart as any).associate = (models: any) => {
    UserCart.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
    UserCart.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product"
    });
};

export default UserCart;