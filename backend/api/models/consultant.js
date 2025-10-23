// models/Consultant.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Consultant = sequelize.define(
  "Consultant",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    legal_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: "id",
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "consultants",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Consultant.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Consultant.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

export default Consultant;
