import { DataTypes, Model } from "@sequelize/core";
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



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Dimension.init({
    dimensionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        allowNull: false
    },
    dimensionBreadth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dimensionHeight: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dimensionUnit: {
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
    tableName: "dimensions",
    timestamps: true,
    paranoid: true
});

export default Dimension;