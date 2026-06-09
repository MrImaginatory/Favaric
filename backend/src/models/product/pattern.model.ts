import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Pattern extends Model {
    public patternId!: string;
    public patternName!: string;
    public patternSlug!: string;
    public patternDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Pattern.init({
    patternId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    patternName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patternSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patternDescription: {
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
    tableName: "patterns",
    timestamps: true,
    paranoid: true
});

(Pattern as any).associate = (models: any) => {
    Pattern.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Pattern.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Pattern;