import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto my-8 px-4">
        <h4 className="text-3xl font-semibold text-center text-gray-800 mb-4">Category - {category?.name}</h4>
        <h6 className="text-xl text-center text-gray-600 mb-8">{products?.length} results found</h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                alt={p.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">{p.name}</h5>
                  <h5 className="text-xl font-bold text-gray-900">
                    {p.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </h5>
                </div>
                <p className="text-sm text-gray-600 mb-4">{p.description.substring(0, 60)}...</p>
                <div className="flex justify-between">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  {/* Uncomment to add cart functionality
                  <button
                    className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition duration-200"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                  */}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination can be added here */}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
