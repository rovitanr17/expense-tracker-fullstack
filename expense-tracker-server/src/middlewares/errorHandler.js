export function errorHandler(err, req, res, next) {
  // Sequelize validation error
  if (err?.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors.map((e) => e.message),
    });
  }

  // FK error (categoryId tidak ada)
  if (err?.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      message: "Foreign key error",
      errors: ["categoryId tidak valid / category tidak ditemukan"],
    });
  }

  console.error(err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
}
