import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Dimension extends Model {
    public dimensionId!: string;

    public dimensionName!: string;
    public dimensionSlug!: string;
    public dimensionDescription!: string;

    public dimensionLength!: number;
    public dimensionBreadth!: number;
    public dimensionHeight!: number;
    public dimensionUnit!: string;



    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Dimension.init({
    dimensionId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    dimensionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dimensionSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dimensionDescription: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dimensionLength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "in cm"
    },
    dimensionBreadth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "in cm"
    },
    dimensionHeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "in cm"
    },
    dimensionUnit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "cm",
        comment: "in cm"
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
    tableName: "dimensions",
    timestamps: true,
    paranoid: true
});

(Dimension as any).associate = (models: any) => {
    Dimension.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Dimension.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Dimension;