import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "title wajib diisi" },
        len: { args: [2, 100], msg: "title 2-100 karakter" },
      },
    },

    // ✅ DECIMAL biar bisa 99.74
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "amount harus angka" },
      },
    },

    // ✅ currency per transaksi
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "IDR",
      validate: {
        notEmpty: { msg: "currency wajib diisi" },
        len: { args: [3, 3], msg: "currency harus 3 huruf (contoh: IDR)" },
      },
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: "date harus format tanggal valid" },
      },
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: "categoryId harus angka" },
        notNull: { msg: "categoryId wajib diisi" },
      },
    },
  },
  { tableName: "Transactions" }
);
