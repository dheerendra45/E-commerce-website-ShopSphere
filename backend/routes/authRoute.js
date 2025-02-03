import express from "express";
import { registerController, loginController, testController } from "../controllers/authController.js";
import {requireSignIn,isAdmin} from "../middlewares/AuthMiddleware.js"; // Ensure this file exists and is correctly implemented

const router = express.Router();

// Routing
// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Test
router.get("/test",requireSignIn,isAdmin, testController);

// User authentication check
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
