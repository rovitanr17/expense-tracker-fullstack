import express from "express";
import cors from "cors";

import categoryRoute from "./routes/category.route.js";
import transactionRoute from "./routes/transaction.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API OK" });
});

app.use("/categories", categoryRoute);
app.use("/transactions", transactionRoute);

// error handler harus paling bawah
app.use(errorHandler);

export default app;
