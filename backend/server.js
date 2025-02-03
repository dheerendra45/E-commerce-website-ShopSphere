import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productroute.js"
import cors from "cors";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product",productRoutes)


// Default route
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to my server",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on ${process.env.DEV_MODE} mode at port ${port}`);
});
