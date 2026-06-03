import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Volume extends Model {
    public volumeId!: string;
    public volumeName!: string;
    public volumeSlug!: string;
    public volumeValue!: number;



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Volume.init({
    volumeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    volumeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volumeSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    volumeValue: {
        type: DataTypes.INTEGER,
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
    tableName: "volumes",
    timestamps: true,
    paranoid: true
})

export default Volume;