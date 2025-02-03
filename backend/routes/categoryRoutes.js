import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";
import { 
    createCategoryController, 
    updateCategoryController, 
    getCategoryController, 
    getSingleCategoryController, 
    deleteCategoryController 
} from "../controllers/CategoryController.js";

const router = express.Router();

// Create Category Route
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// Update Category Route
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// Get All Categories Route
router.get('/get-category', getCategoryController);

// Get Single Category Route
router.get('/single-category/:slug', getSingleCategoryController);

// Delete Category Route
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;
