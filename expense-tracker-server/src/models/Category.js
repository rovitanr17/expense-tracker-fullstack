import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "name wajib diisi" },
        len: { args: [2, 50], msg: "name minimal 2 karakter, maksimal 50 karakter" },
      },
    },
  },
  { tableName: "Categories" }
);
