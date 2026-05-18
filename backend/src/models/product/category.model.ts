import { DataTypes, Model } from "@sequelize/core";
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

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Category.init({
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categorySlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryImage: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: "categories",
    timestamps: true,
    paranoid: true
});

(Category as any).associate = (models: any) => {
    Category.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subcategories"
    });
};

export default Category;