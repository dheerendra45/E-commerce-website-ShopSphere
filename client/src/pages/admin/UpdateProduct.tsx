import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  // Get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
    // eslint-disable-next-line
  }, []);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Update product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are you sure you want to delete this product?");
      if (!answer) return;
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/product/delete-product/${id}`
      );
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid mx-auto p-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 p-4">
            <AdminMenu />
          </div>
          <div className="w-full md:w-3/4 p-4">
            <h1 className="text-2xl font-bold mb-6">Update Product</h1>
            <div className="space-y-4">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="w-full mb-4"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-4">
                <label className="block bg-gray-200 text-gray-700 py-2 px-4 rounded cursor-pointer hover:bg-gray-300">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              <div className="mb-4">
                {photo ? (
                  <div className="flex justify-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      className="h-48 object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <img
                      src={`http://localhost:8080/api/v1/product/get-photo/${id}`}
                      alt="product_photo"
                      className="h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>

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
                rows="4"
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
                onChange={(value) => setShipping(value)}
                value={shipping ? "Yes" : "No"}
              >
                <Option value="0">No</Option>
                <Option value="1">Yes</Option>
              </Select>

              <div className="flex space-x-4">
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={handleUpdate}
                >
                  UPDATE PRODUCT
                </button>
                <button
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;