import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class User extends Model {
    public userId!: number;

    public firstName!: string;
    public lastName!: string;
    public userName!: string;

    public email!: string;
    public password!: string;

    public countryCode!: string;
    public mobile!: string;
    public whatsAppNumberCountryCode!: string;
    public whatsAppNumber!: string;

    public gender!: string;
    public profilePicture!: string;

    public country!: string;
    public state!: string;
    public city!: string;

    public role!: string;
    public isActive!: boolean;
    public isDeleted!: boolean;
}

User.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    whatsAppNumberCountryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whatsAppNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("Admin", "Retailer", "Customer"),
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users"
});

(User as any).associate = (models: any) => {
    User.hasMany(models.UserAddress, {
        foreignKey: "userId",
        as: "addresses"
    });
    User.hasMany(models.UserWishList, {
        foreignKey: "userId",
        as: "wishlist"
    });
};

export default User;