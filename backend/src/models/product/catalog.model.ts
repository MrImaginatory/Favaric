import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Catalog extends Model {
    public catalogId!: string;
    public catalogName!: string;
    public catalogSlug!: string;
    public catalogDescription!: string;
    public catalogImage!: string;
    public catalogSubImages!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Catalog.init({
    catalogId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    catalogName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catalogSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catalogDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catalogImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    catalogSubImages: {
        type: DataTypes.JSON,
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
    tableName: "catalogs",
    timestamps: true,
    paranoid: true
});

(Catalog as any).associate = (models: any) => {
    Catalog.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Catalog.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
    Catalog.hasMany(models.Product, {
        foreignKey: "catalogId",
        as: "products"
    });
};

export default Catalog;