import { Transaction, Category } from "../models/index.js";

export const TransactionController = {
  async getAll(req, res, next) {
    try {
      const { categoryId } = req.query;

      const where = {};
      if (categoryId) where.categoryId = Number(categoryId);

      const data = await Transaction.findAll({
        where,
        include: [{ model: Category }],
        order: [["date", "DESC"], ["id", "DESC"]],
      });

      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const found = await Transaction.findByPk(id, {
        include: [{ model: Category }],
      });

      if (!found) return res.status(404).json({ message: "Transaction not found" });
      res.json(found);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, amount, date, categoryId, currency } = req.body;

      // ✅ normalize: "99,74" -> "99.74"
      const normalizedAmount = String(amount).replace(",", ".");

      const created = await Transaction.create({
        title,
        amount: normalizedAmount,
        date,
        categoryId,
        currency,
      });

      const withCategory = await Transaction.findByPk(created.id, {
        include: [{ model: Category }],
      });

      res.status(201).json(withCategory);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, amount, date, categoryId, currency } = req.body;

      const found = await Transaction.findByPk(id);
      if (!found) return res.status(404).json({ message: "Transaction not found" });

      // ✅ normalize: "99,74" -> "99.74"
      const normalizedAmount = String(amount).replace(",", ".");

      await found.update({
        title,
        amount: normalizedAmount,
        date,
        categoryId,
        currency,
      });

      const withCategory = await Transaction.findByPk(id, {
        include: [{ model: Category }],
      });

      res.json(withCategory);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;

      const found = await Transaction.findByPk(id);
      if (!found) return res.status(404).json({ message: "Transaction not found" });

      await found.destroy();
      res.json({ message: "Transaction deleted" });
    } catch (err) {
      next(err);
    }
  },
};
