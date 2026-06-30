import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserCart extends Model {
    public cartId!: string;
    public userId!: string;
    public productId!: string;
    public quantity!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;
}
UserCart.init({
    cartId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
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
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "userCart",
    tableName: "userCart",
    timestamps: true,
    paranoid: true
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