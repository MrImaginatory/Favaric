import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Product extends Model {
    public productId!: string;

    public productName!: string;
    public productTitle!: string;
    public productSlug!: string;
    public productDescription!: string;

    public regularPrice!: number;
    public salePrice!: number;
    public currency!: string;
    public gstPercentage!: number;

    public category!: string;
    public subCategory!: string;

    public brand!: string;

    public thumbnailImage!: string;
    public image!: string;
    public subImages!: string[];

    public stock!: number;
    public maxOrderQty!: number;
    public minOrderQty!: number;

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

    public uploadedBy!: string;
    public lastModifiedBy!: string;

    public isCatalog!: boolean;
    public catalogId!: string;

    public isPinned!: boolean;
    public pinPosition!: number;

    public productType!: string;
    public quantityPerUnit!: string;

    public shippingCharge!: string;

    public productStitched!: boolean;

    public moq!: number;
    public otherDetails!: string;

    public deletedAt!: Date;
}

Product.init({
    productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.UUID,
        allowNull: false
    },
    subCategory: {
        type: DataTypes.UUID,
        allowNull: false
    },
    brand: {
        type: DataTypes.UUID,
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
    maxOrderQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
    },
    minOrderQty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
        type: DataTypes.UUID,
        allowNull: false
    },
    occasion: {
        type: DataTypes.UUID,
        allowNull: false
    },
    pattern: {
        type: DataTypes.UUID,
        allowNull: false
    },
    length: {
        type: DataTypes.UUID,
        allowNull: false
    },
    transparency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryOfOrigin: {
        type: DataTypes.UUID,
        allowNull: false
    },
    color: {
        type: DataTypes.UUID,
        allowNull: false
    },
    size: {
        type: DataTypes.UUID,
        allowNull: false
    },
    weight: {
        type: DataTypes.UUID,
        allowNull: false
    },
    dimensions: {
        type: DataTypes.UUID,
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
    productType: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantityPerUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCharge: {
        type: DataTypes.UUID,
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

    Product.belongsToMany(models.Color, {
        through: "product_colors",
        foreignKey: "productId",
        otherKey: "colorId",
        as: "colors"
    });
    Product.belongsToMany(models.Size, {
        through: "product_sizes",
        foreignKey: "productId",
        otherKey: "sizeId",
        as: "sizes"
    });
    Product.belongsToMany(models.Pattern, {
        through: "product_patterns",
        foreignKey: "productId",
        otherKey: "patternId",
        as: "patterns"
    });
    Product.belongsToMany(models.Occasion, {
        through: "product_occasions",
        foreignKey: "productId",
        otherKey: "occasionId",
        as: "occasions"
    });
    Product.belongsToMany(models.Fabric, {
        through: "product_fabrics",
        foreignKey: "productId",
        otherKey: "fabricId",
        as: "fabrics"
    });
};

export default Product;