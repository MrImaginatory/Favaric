import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Brand extends Model {
    public brandId!: string;
    public brandName!: string;
    public brandSlug!: string;
    public brandDescription!: string;
    public brandLogo!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Brand.init({
    brandId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
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
        allowNull: true
    },
    brandLogo: {
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
    tableName: "brands",
    timestamps: true,
    paranoid: true
});

(Brand as any).associate = (models: any) => {
    Brand.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Brand.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Brand;