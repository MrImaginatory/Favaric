import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class User extends Model {
    public userId!: string;

    public firstName!: string;
    public lastName!: string;
    public userName!: string;

    public email!: string;
    public password!: string;

    public countryCode!: number;
    public mobile!: string;
    public whatsAppNumberCountryCode!: number;
    public whatsAppNumber!: string;

    public gender!: string;
    public profilePicture!: string;

    public country!: string;
    public state!: string;
    public city!: string;

    public resetPasswordToken!: string;
    public resetPasswordExpires!: Date;

    public role!: string;
    public isActive!: boolean;
    public isVerified!: boolean;
    public isDeleted!: boolean;
}

User.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
        unique: true,
        set(value: string) {
            this.setDataValue('userName', value.toLowerCase());
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    whatsAppNumberCountryCode: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    whatsAppNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM("Admin", "Retailer", "Customer"),
        allowNull: false,
        defaultValue: "Customer"
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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