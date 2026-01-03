import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { testDbConnection } from "./config/database.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await testDbConnection();
    console.log("DB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
}

start();
