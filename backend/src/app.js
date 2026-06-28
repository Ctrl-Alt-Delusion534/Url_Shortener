import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { nanoid } from "nanoid";
import shorturl from "./models/shorturl.model.js";
import connectDB from "./config/mongo.config.js";
import authRoutes from "./routes/auth.routes.js";
import shortUrlRoutes from "./routes/short-url.routes.js";
import { redirectfromShortUrl } from "./controller/short-url.controller.js";
import errorHandler from "./utils/errorHandler.js";
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.APP_URL
        ? process.env.APP_URL.replace(/\/$/, "")
        : "";
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === allowedOrigin
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/create",shortUrlRoutes);
app.get("/:id",redirectfromShortUrl);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port http://localhost:3000");
    });
  } catch (err) {
    process.exit(1);
  }
};

startServer();

