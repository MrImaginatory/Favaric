import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserWishList extends Model {
    public id!: number;
    public userId!: number;
    public productId!: number;
}

UserWishList.init({
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
