import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Occasion extends Model {
    public occasionId!: string;
    public occasionName!: string;
    public occasionSlug!: string;
    public occasionDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Occasion.init({
    occasionId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    occasionName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    occasionSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    occasionDescription: {
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
    tableName: "occasions",
    timestamps: true,
    paranoid: true
});

(Occasion as any).associate = (models: any) => {

    Occasion.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Occasion.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Occasion;