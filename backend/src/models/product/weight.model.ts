import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Weight extends Model {
    public weightId!: string;
    public weightName!: string;
    public weightSlug!: string;
    public weightValue!: number;
    public weightUnit!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Weight.init({
    weightId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    tableName: "weights",
    timestamps: true,
    paranoid: true
})

export default Weight;
