import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Pattern extends Model {
    public patternId!: string;
    public patternName!: string;
    public patternSlug!: string;
    public patternDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Pattern.init({
    patternId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patternName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patternSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patternDescription: {
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
    tableName: "patterns",
    timestamps: true,
    paranoid: true
});

(Pattern as any).associate = (models: any) => {
    Pattern.belongsToMany(models.Product, {
        through: "product_patterns",
        foreignKey: "patternId",
        otherKey: "productId",
        as: "products"
    });
};

export default Pattern;