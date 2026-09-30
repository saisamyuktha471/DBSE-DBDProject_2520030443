const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Return = sequelize.define(
  "Return",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    returnNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Processing",
        "Approved",
        "Rejected",
        "Completed"
      ),
      defaultValue: "Processing",
    },
  },
  {
    tableName: "returns",
    timestamps: true,
  }
);

module.exports = Return;