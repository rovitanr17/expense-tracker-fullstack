import { Category } from "../models/index.js";

export const CategoryController = {
  async getAll(req, res, next) {
    try {
      const data = await Category.findAll({ order: [["id", "ASC"]] });
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const created = await Category.create({ name });
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const found = await Category.findByPk(id);
      if (!found) return res.status(404).json({ message: "Category not found" });

      await found.update({ name });
      res.json(found);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.params;

      const found = await Category.findByPk(id);
      if (!found) return res.status(404).json({ message: "Category not found" });

      await found.destroy();
      res.json({ message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  },
};
