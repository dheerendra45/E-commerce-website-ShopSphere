import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const getAllProducts = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("auth"))?.token;
    console.log("Token retrieved during getAllProducts:", token);

    if (!token) {
      toast.error("❌ Please log in first.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      "http://localhost:8080/api/v1/product/get-products", // Make sure to correct the API URL
      { headers }
    );

    console.log("Full Response from Backend:", response);
    console.log("Backend Response Data:", response.data);

    if (response.data?.success) {
      console.log("Products received:", response.data.products); // Corrected key
      setProducts(response.data.products); // Corrected key
    } else {
      console.log("Error Message from Backend:", response.data.message);
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log("Error fetching products:", error.response?.data || error.message);
    toast.error("Something went wrong while fetching products");
  }
};


  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row p-4">
        <div className="md:w-1/4 p-4">
          <AdminMenu />
        </div>
        <div className="md:w-3/4 p-4">
          <h1 className="text-2xl font-bold text-center mb-4">All Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={`http://localhost:8080/api/v1/product/get-photo/${p._id}`}
                  className="w-full h-48 object-cover"
                  alt={p.name}
                />
                <div className="p-4">
                  <h5 className="text-lg font-semibold">{p.name}</h5>
                  <p className="text-gray-600 text-sm mt-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;