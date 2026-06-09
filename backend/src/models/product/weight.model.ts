import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Weight extends Model {
    public weightId!: string;
    public weightName!: string;
    public weightSlug!: string;
    public weightValue!: number;
    public weightUnit!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Weight.init({
    weightId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    weightName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weightSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weightValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weightUnit: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "grams",
        comment: "in grams"
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
    tableName: "weights",
    timestamps: true,
    paranoid: true
});

(Weight as any).associate = (models: any) => {
    Weight.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Weight.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Weight;
