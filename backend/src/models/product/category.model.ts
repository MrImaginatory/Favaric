import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Category extends Model {
    public categoryId!: string;
    public categoryName!: string;
    public categorySlug!: string;
    public categoryDescription!: string;
    public categoryImage!: string;

    public isFeatured!: boolean;
    public isPopular!: boolean;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Category.init({
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    categoryName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    categorySlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    categoryDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categoryImage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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
    tableName: "categories",
    timestamps: true,
    paranoid: true
});

(Category as any).associate = (models: any) => {
    Category.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subcategories"
    });
    Category.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Category.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Category;