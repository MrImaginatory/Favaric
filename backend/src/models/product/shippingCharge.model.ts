import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class ShippingCharge extends Model {
    public chargeId!: string;
    public baseCountry!: string;
    public shippingPrice!: number;
    public isFreeShipping!: boolean;
    public minimumOrderAmount!: number;
    public weightSlabFrom!: number;
    public weightSlabTo!: number;
    public status!: boolean;



    public uploadedBy!: number;
    public lastModifiedBy!: number;
    public deletedAt!: Date;
}

ShippingCharge.init({
    chargeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    baseCountry: {
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
    minimumOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    weightSlabFrom: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    weightSlabTo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
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