import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Fabric extends Model {
    public fabricId!: string;
    public fabricName!: string;
    public fabricSlug!: string;
    public fabricDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Fabric.init({
    fabricId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fabricName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fabricSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fabricDescription: {
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
    tableName: "fabrics",
    timestamps: true,
    paranoid: true
});

(Fabric as any).associate = (models: any) => {
    Fabric.belongsToMany(models.Product, {
        through: "product_fabrics",
        foreignKey: "fabricId",
        otherKey: "productId",
        as: "products"
    });
};

export default Fabric;