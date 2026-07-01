import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Metrics extends Model {
    declare metricId: string;
    declare metricName: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Metrics.init({
    metricId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    metricName: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "metrics",
    timestamps: true,
    paranoid: true
});

(Metrics as any).associate = (models: any) => {
    Metrics.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Metrics.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
    Metrics.hasMany(models.Dimension, {
        foreignKey: "metricId",
        as: "dimensions"
    });
    Metrics.hasMany(models.Length, {
        foreignKey: "metricId",
        as: "lengths"
    });
    Metrics.hasMany(models.Weight, {
        foreignKey: "metricId",
        as: "weights"
    });
};

export default Metrics;