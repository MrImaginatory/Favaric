import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Color extends Model {
    public colorId!: string;
    public colorName!: string;
    public colorSlug!: string;
    public colorCode!: string;



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Color.init({
    colorId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    colorName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    colorSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    colorCode: {
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
    tableName: "colors",
    timestamps: true,
    paranoid: true
});

(Color as any).associate = (models: any) => {
    Color.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Color.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Color;