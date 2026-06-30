import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserWishList extends Model {
    public wishListId!: string;
    public userId!: string;
    public productId!: string;
    public deletedAt!: Date;
}

UserWishList.init({
    wishListId: {
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
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "userWishList",
    tableName: "userWishList",
    timestamps: true,
    paranoid: true
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
