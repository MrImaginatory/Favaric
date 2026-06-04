import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class ProductType extends Model {
    public productTypeId!: string;
    public productTypeName!: string;
    public productTypeSlug!: string;
    public productTypeDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

ProductType.init({
    productTypeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    productTypeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productTypeSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productTypeDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    metaTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metaDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metaKeywords: {
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
    tableName: "productTypes",
    timestamps: true,
    paranoid: true
})

export default ProductType;