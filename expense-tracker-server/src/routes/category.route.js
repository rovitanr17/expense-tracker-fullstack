import { Router } from "express";
import { body } from "express-validator";
import { CategoryController } from "../controllers/category.controller.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", CategoryController.getAll);

router.post(
  "/",
  body("name").notEmpty().withMessage("name wajib diisi").isLength({ min: 2, max: 50 }).withMessage("name 2-50 karakter"),
  validate,
  CategoryController.create
);

router.put(
  "/:id",
  body("name").notEmpty().withMessage("name wajib diisi").isLength({ min: 2, max: 50 }).withMessage("name 2-50 karakter"),
  validate,
  CategoryController.update
);

router.delete("/:id", CategoryController.remove);

export default router;
