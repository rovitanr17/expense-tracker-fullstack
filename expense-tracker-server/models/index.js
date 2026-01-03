import { Category } from "./Category.js";
import { Transaction } from "./Transaction.js";

Category.hasMany(Transaction, { foreignKey: "categoryId", onDelete: "RESTRICT" });
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

export { Category, Transaction };
