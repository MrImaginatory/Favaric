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
        type: DataTypes.STRING,
        allowNull: false
    },
    occasionSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occasionDescription: {
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