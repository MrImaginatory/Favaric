import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserWishList extends Model {
    public wishListId!: string;
    public userId!: string;
    public productId!: string;
}

UserWishList.init({
    wishListId: {
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
    }
}, {
    sequelize,
    modelName: "userWishList",
    tableName: "userWishList"
});

(UserWishList as any).associate = (models: any) => {
    UserWishList.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
    UserWishList.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product"
    });
};

export default UserWishList;
