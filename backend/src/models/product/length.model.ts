import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Length extends Model {
    public lengthId!: string;
    public lengthName!: string;
    public lengthSlug!: string;

    public lengthValue!: number;
    public lengthUnit!: string;



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Length.init({
    lengthId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    lengthName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lengthSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lengthValue: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lengthUnit: {
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
    tableName: "lengths",
    timestamps: true,
    paranoid: true
});

export default Length;
