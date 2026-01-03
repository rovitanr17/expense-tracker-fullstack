import { Router } from "express";
import { body } from "express-validator";
import { TransactionController } from "../controllers/transaction.controller.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router.get("/", TransactionController.getAll);
router.get("/:id", TransactionController.getById);

const trxRules = [
  body("title")
    .notEmpty().withMessage("title wajib diisi")
    .isLength({ min: 2, max: 100 }).withMessage("title 2-100 karakter"),

  body("amount")
    .isFloat({ gt: 0 }).withMessage("amount harus angka dan > 0"),

  body("date")
    .notEmpty().withMessage("date wajib diisi")
    .isISO8601().withMessage("date harus format YYYY-MM-DD"),

  body("categoryId")
    .isInt({ min: 1 }).withMessage("categoryId wajib angka"),

  body("currency")
    .notEmpty().withMessage("currency wajib diisi")
    .isLength({ min: 3, max: 3 }).withMessage("currency harus 3 huruf (contoh: IDR)"),
];

router.post("/", trxRules, validate, TransactionController.create);
router.put("/:id", trxRules, validate, TransactionController.update);

router.delete("/:id", TransactionController.remove);

export default router;
