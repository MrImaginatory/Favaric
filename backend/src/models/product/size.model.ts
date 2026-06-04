import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Size extends Model {
    public sizeId!: string;
    public sizeName!: string;
    public sizeSlug!: string;
    public sizeValue!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Size.init({
    sizeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sizeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sizeSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sizeValue: {
        type: DataTypes.STRING,
        allowNull: false
    },

    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastModifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "sizes",
    timestamps: true,
    paranoid: true
});

(Size as any).associate = (models: any) => {
    Size.belongsToMany(models.Product, {
        through: "product_sizes",
        foreignKey: "sizeId",
        otherKey: "productId",
        as: "products"
    });
};

export default Size;