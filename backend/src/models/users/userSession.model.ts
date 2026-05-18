import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../../database/database.js";

class UserSession extends Model {
    public sessionId!: string;
    public userId!: string;
    public userName!: string;
    public ipAddress!: string;
    public location!: string;
    public os!: string;
    public userAgent!: string;
    public expiresAt!: Date;
}

UserSession.init({
    sessionId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    os: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "UserSession",
    tableName: "user_sessions",
    timestamps: true,
});

(UserSession as any).associate = (models: any) => {
    UserSession.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
    });
};

export default UserSession;
