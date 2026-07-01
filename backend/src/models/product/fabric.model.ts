import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Fabric extends Model {
    public fabricId!: string;
    public fabricName!: string;
    public fabricSlug!: string;
    public fabricDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Fabric.init({
    fabricId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    fabricName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fabricSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fabricDescription: {
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
    tableName: "fabrics",
    timestamps: true,
    paranoid: true
});

(Fabric as any).associate = (models: any) => {
    Fabric.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Fabric.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Fabric;