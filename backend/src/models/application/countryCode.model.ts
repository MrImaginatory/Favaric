import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class CountryCode extends Model {
    public countryCodeId!: string;
    public countryName!: string;
    public callingCode!: string;
    public isoCode!: string;
    public deletedAt!: Date;
}
CountryCode.init({
    countryCodeId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    countryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    callingCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isoCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: "countryCodes",
    timestamps: true,
    paranoid: true,
    timestamps: false,
    paranoid: false
});

export default CountryCode;