import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./helpers/env.js";
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no Origin header) and configured frontend origins.
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.use(errorHandler);

export default app;
