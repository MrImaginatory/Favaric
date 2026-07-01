import { DataTypes, sql, Model } from "@sequelize/core";
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

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

SubCategory.init({
    subCategoryId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    subcategoryName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subcategorySlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subcategoryDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subcategoryImage: {
        type: DataTypes.TEXT,
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
    tableName: "subcategories",
    timestamps: true,
    paranoid: true
});

(SubCategory as any).associate = (models: any) => {
    SubCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category"
    });
    SubCategory.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    SubCategory.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default SubCategory;
