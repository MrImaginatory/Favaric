import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Color extends Model {
    public colorId!: string;
    public colorName!: string;
    public colorSlug!: string;
    public colorCode!: string;



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Color.init({
    colorId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    colorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colorSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colorCode: {
        type: DataTypes.STRING,
        allowNull: false
    },

    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "colors",
    timestamps: true,
    paranoid: true
});

(Color as any).associate = (models: any) => {
    Color.belongsToMany(models.Product, {
        through: "product_colors",
        foreignKey: "colorId",
        otherKey: "productId",
        as: "products"
    });
};

export default Color;