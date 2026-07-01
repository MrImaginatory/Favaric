import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class ProductType extends Model {
    public productTypeId!: string;
    public productTypeName!: string;
    public productTypeSlug!: string;
    public productTypeDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

ProductType.init({
    productTypeId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    productTypeName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    productTypeSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    productTypeDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metaTitle: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    metaKeywords: {
        type: DataTypes.TEXT,
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
    tableName: "productTypes",
    timestamps: true,
    paranoid: true
});

(ProductType as any).associate = (models: any) => {
    ProductType.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    ProductType.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default ProductType;