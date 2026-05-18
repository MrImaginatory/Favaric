import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class SubCategory extends Model {
    public subCategoryId!: string;
    public subcategoryName!: string;
    public subcategorySlug!: string;
    public subcategoryDescription!: string;
    public subcategoryImage!: string;

    public categoryId!: string;

    public isFeatured!: boolean;
    public isPopular!: boolean;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

SubCategory.init({
    subCategoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    subcategoryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subcategorySlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subcategoryDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
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
    tableName: "subcategories",
    timestamps: true,
    paranoid: true
});

(SubCategory as any).associate = (models: any) => {
    SubCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category"
    });
};

export default SubCategory;
