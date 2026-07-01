import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserSession extends Model {
    public sessionId!: string;
    public userId!: string;
    public userName!: string;
    public ipAddress!: string;
    public location!: string;
    public os!: string;
    public refreshToken!: string;
    public userAgent!: string;
    public expiresAt!: Date;
    public deletedAt!: Date;
}
UserSession.init({
    sessionId: {
        type: DataTypes.TEXT,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userName: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    os: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "UserSession",
    tableName: "user_sessions",
    timestamps: true,
    paranoid: true,
    timestamps: true,
});

(UserSession as any).associate = (models: any) => {
    UserSession.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
};

export default UserSession;
