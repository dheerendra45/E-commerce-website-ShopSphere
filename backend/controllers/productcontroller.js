import ProductModel from "../models/Productmodel.js";
import Category from "../models/Categorymodel.js";
import fs from 'fs';
import slugify from "slugify";
import formidable from 'formidable';

// Create Product Controller
export const createProductController = (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: "Error in form parsing", message: err });
    }

    const { name, description, price, category, quantity, shipping } = fields;
    const { photo } = files;

    // Validate the fields
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    try {
      // Get the ObjectId of the category
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).send({ error: `Category "${category}" not found` });
      }

      // Create the product
      const product = new ProductModel({
        ...fields,
        category: categoryDoc._id,  // Pass the ObjectId of the category here
        slug: slugify(name),
      });

      if (photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
      }

      await product.save();

      res.status(201).send({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in creating product",
        error,
      });
    }
  });
};
// Get All Products Controller
export const getProductController = async (req, res) => {
    try {
        const products = await ProductModel.find({}).select("-photo").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: 'All products',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error
        });
    }
};

// Get Single Product Controller
export const singleProductController = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug }).select("-photo").populate("category");
        res.status(200).send({
            success: true,
            message: 'Single product',
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error
        });
    }
};
export const deleteProductController = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.pid).select("-photo");
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };

  export const updateProductController = (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Error in form parsing", message: err });
        }

        const { name, description, price, category, quantity, shipping } = fields;
        const { photo } = files;

        // Validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is required and should be less than 1MB" });
        }

        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                req.params.pid,
                { ...fields, slug: slugify(name) },
                { new: true }
            );

            if (photo) {
                updatedProduct.photo.data = fs.readFileSync(photo.path);
                updatedProduct.photo.contentType = photo.type;
            }

            await updatedProduct.save();
            res.status(201).send({
                success: true,
                message: "Product Updated Successfully",
                product: updatedProduct,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                error,
                message: "Error in Update product",
            });
        }
    });
};


// Get Product Photo Controller
export const getPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting photo",
            error
        });
    }
};
export  const productfiltercontroller=async( req,res)=>
{
  try {
    const {checked,radio}=req.body
    let args={}
    if(checked.length>0) args.category=checked
    if(radio.length) args.price={$gte: radio[0], $lte:radio[0]}
    const products=await ProductModel.find(args)
    res.status(200).send({
      success:true,
      products,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "Error in filtering",
        error
    });
    
    
  }
}
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    console.log("Search Results: ", results);  // Log the results

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};