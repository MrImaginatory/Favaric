import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Size extends Model {
    public sizeId!: string;
    public sizeName!: string;
    public sizeSlug!: string;
    public sizeValue!: string;

    public uploadedBy!: string;
    public lastModifiedBy!: string;
    public deletedAt!: Date;
}

Size.init({
    sizeId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    sizeName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sizeSlug: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sizeValue: {
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
    tableName: "sizes",
    timestamps: true,
    paranoid: true
});

(Size as any).associate = (models: any) => {
    Size.belongsTo(models.User, {
        foreignKey: "uploadedBy",
        as: "uploader"
    });
    Size.belongsTo(models.User, {
        foreignKey: "lastModifiedBy",
        as: "modifier"
    });
};

export default Size;