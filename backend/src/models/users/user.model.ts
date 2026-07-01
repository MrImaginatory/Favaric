import { DataTypes, sql, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class User extends Model {
    public userId!: string;

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

    public resetPasswordToken!: string;
    public resetPasswordExpires!: Date;

    public role!: string;
    public isActive!: boolean;
    public isVerified!: boolean;
    public deletedAt!: Date;
}
User.init({
    userId: {
        type: DataTypes.UUID,
        defaultValue: sql.uuidV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastName: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userName: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('userName', value.toLowerCase());
        }
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.UUID,
        allowNull: false
    },
    mobile: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    whatsAppNumberCountryCode: {
        type: DataTypes.UUID,
        allowNull: true
    },
    whatsAppNumber: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true
    },
    gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    country: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    state: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM("Admin", "Retailer", "Customer"),
        allowNull: false,
        defaultValue: "Customer"
    },
    resetPasswordToken: {
        type: DataTypes.TEXT,
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
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    paranoid: true
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
    User.belongsTo(models.CountryCode, {
        foreignKey: "countryCode",
        as: "countryDetails"
    });
    User.belongsTo(models.CountryCode, {
        foreignKey: "whatsAppNumberCountryCode",
        as: "whatsAppCountryDetails"
    });
};

export default User;