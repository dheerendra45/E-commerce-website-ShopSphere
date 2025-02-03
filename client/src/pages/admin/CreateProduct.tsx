import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [shipping, setShipping] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  // Get all categories with better error handling
  const getAllCategory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        "http://localhost:8080/api/v1/category/get-category",
        { headers }
      );

      if (response.data?.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data?.message || "Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle product creation with improved error feedback
  const handleCreate = async (e) => {
  e.preventDefault();

  if (!category || !name || !description || !price || !quantity || !photo) {
    toast.error("Please fill in all the fields");
    return;
  }

  try {
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("price", price);
    productData.append("quantity", quantity);

    if (photo) {
      productData.append("photo", photo);
    }
    productData.append("category", category);

    const token = JSON.parse(localStorage.getItem("auth"))?.token;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const { data } = await axios.post(
      "http://localhost:8080/api/v1/product/create-product",
      productData,
      { headers }
    );

    if (data?.success) {
      toast.success("Product Created Successfully");
      navigate("/dashboard/admin/products");
    } else {
      toast.error(data?.message || "Failed to create product");
    }
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error("Something went wrong while creating the product");
  }
};

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid mx-auto p-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 p-4">
            <AdminMenu />
          </div>
          <div className="w-full md:w-3/4 p-4">
            <h1 className="text-2xl font-bold mb-6">Create Product</h1>
            <div className="space-y-4">
              {/* Category selection */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="w-full mb-4"
                onChange={(value) => setCategory(value as string)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* Product photo */}
              <div className="mb-4">
                <label className="block bg-gray-200 text-gray-700 py-2 px-4 rounded cursor-pointer hover:bg-gray-300">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                    hidden
                  />
                </label>
              </div>

              {photo && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    className="h-48 object-cover rounded"
                  />
                </div>
              )}

              {/* Input fields */}
              <input
                type="text"
                value={name}
                placeholder="Product Name"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                value={description}
                placeholder="Product Description"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />

              <input
                type="number"
                value={price}
                placeholder="Product Price"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="number"
                value={quantity}
                placeholder="Product Quantity"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Select
                bordered={false}
                placeholder="Select Shipping"
                size="large"
                showSearch
                className="w-full mb-4"
                onChange={(value) => setShipping(value as string)}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleCreate}
              >
                CREATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
