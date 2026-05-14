import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Brand extends Model {
    public brandId!: number;
    public brandName!: string;
    public brandSlug!: string;
    public brandDescription!: string;
    public brandLogo!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Brand.init({
    brandId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    brandName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brandSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brandDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brandLogo: {
        type: DataTypes.STRING,
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
    tableName: "brands",
    timestamps: true,
    paranoid: true
});

export default Brand;