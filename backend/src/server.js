import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./helpers/env.js";

async function start() {
  try {
    await connectDb();
    app.listen(Number(env.port), () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
