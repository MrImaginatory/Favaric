import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserCart extends Model {
    public cartId!: string;
    public userId!: string;
    public productId!: string;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserCart.init({
    cartId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productId: {
        type: DataTypes.UUID,
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