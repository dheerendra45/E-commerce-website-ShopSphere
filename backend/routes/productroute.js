import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/AuthMiddleware.js";
import { createProductController, getProductController, getPhotoController, singleProductController, updateProductController, deleteProductController, productfiltercontroller, searchProductController } from "../controllers/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();


router.put("/update-product/:pid",requireSignIn, isAdmin, formidable(), createProductController, updateProductController)
router.post('/create-product', requireSignIn, isAdmin, createProductController);
router.get('/get-products', getProductController);
router.get('/single-product/:slug', singleProductController);
router.get('/get-photo/:pid', getPhotoController);
router.delete('/delete-product/:pid', requireSignIn, isAdmin, formidable(), createProductController,deleteProductController )
router.post('/product-filters',productfiltercontroller);
router.get("/search/:keyword", searchProductController);

export default router;
