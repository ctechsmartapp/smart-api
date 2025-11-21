// models/Submission.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Consultant from "./consultant.js";
import User from "./user.js";

const Submission = sequelize.define(
  "Submission",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    consultant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Consultant,
        key: "id",
      },
    },
    technology: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vendor: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    interview_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    comments: {
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
    tableName: "submissions",
    timestamps: false,
    underscored: true,
  }
);

// Associations
Submission.belongsTo(Consultant, { foreignKey: "consultant_id" });
Consultant.hasMany(Submission, { foreignKey: "consultant_id" });
Submission.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Submission.belongsTo(User, { as: "updater", foreignKey: "updated_by" });
User.hasMany(Submission, { foreignKey: "consultant_id" });

export default Submission;
