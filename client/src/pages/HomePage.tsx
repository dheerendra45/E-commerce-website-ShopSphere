import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { Banner } from "../components/layout/Banner";
import { Filters } from "../components/Form/filters";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get categories
  const getAllCategory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"))?.token;
      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        "http://localhost:8080/api/v1/category/get-category",
        { headers }
      );
      if (response.data?.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
      toast.error("Something went wrong in getting category");
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"))?.token;
      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/get-products",
        { headers }
      );
      if (response.data?.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Something went wrong while fetching products");
    }
  };

  // Get total count of products
  const getTotal = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Filter products by selected categories and price
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  return (
    <Layout title={"All Products - Best Offers"}>
      {/* Banner */}
      <Banner />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <Filters />
          </div>

          {/* Product Listings */}
          <div className="w-full lg:w-3/4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={`http://localhost:8080/api/v1/product/get-photo/${p._id}`}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-gray-600 mt-2">
                      {p.description.substring(0, 60)}...
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {p.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    </p>
                    <div className="mt-4 space-y-2">
                      <button
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem("cart", JSON.stringify([...cart, p]));
                          toast.success("Item Added to Cart");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {products && products.length < total && (
              <div className="flex justify-center mt-8">
                <button
                  className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Load More"}
                  {!loading && <AiOutlineReload className="ml-2" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;