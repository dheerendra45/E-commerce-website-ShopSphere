import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

// Check if the model is already defined before creating a new one
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
