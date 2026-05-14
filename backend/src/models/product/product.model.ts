import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Product extends Model {
    public productId!: number;

    public productName!: string;
    public productTitle!: string;
    public productSlug!: string;
    public productDescription!: string;

    public regularPrice!: number;
    public salePrice!: number;
    public currency!: string;
    public gstPercentage!: number;

    public category!: number;
    public subCategory!: number;

    public brand!: number;

    public thumbnailImage!: string;
    public image!: string;
    public subImages!: string[];

    public stock!: number;

    public designCode!: string;
    public sku!: string;
    public barcode!: string;
    public hsn!: string;

    public fabric!: string;
    public occasion!: string;
    public pattern!: string;
    public length!: string;
    public transparency!: string;
    public countryOfOrigin!: string;

    public color!: string;
    public size!: string;
    public weight!: string;
    public volume!: string;
    public dimensions!: string;

    public isFeatured!: boolean;
    public isTrending!: boolean;
    public isNewArrival!: boolean;
    public isDiscounted!: boolean;
    public isAvailable!: boolean;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;

    public isCatalog!: boolean;
    public catalogId!: number;

    public isPinned!: boolean;
    public pinPosition!: number;

    public productType!: string;
    public quantityPerUnit!: string;

    public shippingCharge!: number;

    public productStitched!: boolean;

    public moq!: number;
    public otherDetails!: string;

    public deletedAt!: Date;
}

Product.init({
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regularPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "INR"
    },
    gstPercentage: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subCategory: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    thumbnailImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subImages: {
        type: DataTypes.JSON,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    designCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hsn: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fabric: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occasion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pattern: {
        type: DataTypes.STRING,
        allowNull: false
    },
    length: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transparency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryOfOrigin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dimensions: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isTrending: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isNewArrival: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isDiscounted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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
    productType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantityPerUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCharge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    productStitched: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    moq: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    otherDetails: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "products",
    timestamps: true,
    paranoid: true
});

(Product as any).associate = (models: any) => {
    Product.belongsTo(models.Category, {
        foreignKey: "category",
        as: "categoryDetails"
    });
    Product.belongsTo(models.SubCategory, {
        foreignKey: "subCategory",
        as: "subcategoryDetails"
    });
    Product.belongsTo(models.Brand, {
        foreignKey: "brand",
        as: "brandDetails"
    });
};

export default Product;