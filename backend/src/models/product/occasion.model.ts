import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class Occasion extends Model {
    public occasionId!: string;
    public occasionName!: string;
    public occasionSlug!: string;
    public occasionDescription!: string;

    public metaTitle!: string;
    public metaDescription!: string;
    public metaKeywords!: string;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

Occasion.init({
    occasionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    occasionName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occasionSlug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    occasionDescription: {
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
    tableName: "occasions",
    timestamps: true,
    paranoid: true
});

(Occasion as any).associate = (models: any) => {
    Occasion.belongsToMany(models.Product, {
        through: "product_occasions",
        foreignKey: "occasionId",
        otherKey: "productId",
        as: "products"
    });
};

export default Occasion;