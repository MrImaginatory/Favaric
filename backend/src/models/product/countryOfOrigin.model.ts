import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class CountryOfOrigin extends Model {
    public countryOfOriginId!: string;
    public countryOfOriginName!: string;
    public countryOfOriginSlug!: string;
    public countryOfOriginDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

CountryOfOrigin.init({
    countryOfOriginId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    countryOfOriginName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    countryOfOriginSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    countryOfOriginDescription: {
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
    tableName: "country_of_origin",
    timestamps: true,
    paranoid: true
});

(CountryOfOrigin as any).associate = (models: any) => {
    CountryOfOrigin.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    CountryOfOrigin.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default CountryOfOrigin;