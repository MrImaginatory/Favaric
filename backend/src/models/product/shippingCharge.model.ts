import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class ShippingCharge extends Model {
    public shippingChargeId!: string;
    public shippingBaseCountry!: string;
    public shippingPrice!: number;
    public isFreeShipping!: boolean;
    public shippingMinimumOrderAmount!: number;
    public shippingWeightSlabFrom!: number;
    public shippingWeightSlabTo!: number;
    public shippingStatus!: boolean;

    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

ShippingCharge.init({
    shippingChargeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    shippingBaseCountry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    isFreeShipping: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    shippingMinimumOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shippingWeightSlabFrom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "in grams"
    },
    shippingWeightSlabTo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "in grams"
    },
    shippingStatus: {
        type: DataTypes.BOOLEAN,
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
    tableName: "shipping_charges",
    timestamps: true,
    paranoid: true
});

export default ShippingCharge;