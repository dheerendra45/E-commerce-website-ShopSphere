import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token-based authentication
export const requireSignIn = async (req, res, next) => {
  try {
    // Check if token exists in authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({ success: false, message: "Access Denied: No token provided" });
    }
    
    // Extract the token
    const token = req.headers.authorization.split(" ")[1]; 

    // Verify token using JWT
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to the request object
    req.user = decode;
    next(); // Continue to next middleware or controller
  } catch (error) {
    console.error("❌ JWT Verification Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token", error });
  }
};

// Admin access middleware
export const isAdmin = async (req, res, next) => {
  try {
    // Find user by ID from the decoded token
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      console.log("❌ User not found:", req.user._id);
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Check if the user is an admin (role = 1)
    if (user.role !== 1) {
      console.warn("⚠️ Unauthorized Access Attempt by User:", req.user._id);
      return res.status(403).send({ success: false, message: "Unauthorized Access" });
    }

    // If user is admin, proceed to next middleware/controller
    next();
  } catch (error) {
    console.error("❌ Error in Admin Middleware:", error.message);
    res.status(500).send({ 
      success: false, 
      message: "Error in admin middleware", 
      error: error.message 
    });
  }
};
