import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 product-details">
        <div className="flex flex-wrap md:flex-nowrap">
          <div className="w-full md:w-1/2">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="w-full h-72 object-cover rounded-lg shadow-lg"
              alt={product.name}
            />
          </div>
          <div className="w-full md:w-1/2 pl-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Product Details</h1>
            <hr className="my-4" />
            <h6 className="text-lg font-medium">Name: {product.name}</h6>
            <h6 className="text-lg font-medium mt-2">Description: {product.description}</h6>
            <h6 className="text-lg font-medium mt-2">
              Price:{" "}
              {product?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h6>
            <h6 className="text-lg font-medium mt-2">Category: {product?.category?.name}</h6>
            <button className="btn btn-secondary bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-700">
              ADD TO CART
            </button>
          </div>
        </div>
        <hr className="my-8" />
        <div className="similar-products mt-8">
          <h4 className="text-2xl font-semibold mb-4">Similar Products ➡️</h4>
          {relatedProducts.length < 1 && (
            <p className="text-center text-lg text-gray-500">No Similar Products found</p>
          )}
          <div className="flex flex-wrap justify-start gap-4">
            {relatedProducts?.map((p) => (
              <div
                className="card bg-white p-4 w-60 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                key={p._id}
              >
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xl font-semibold text-gray-800">{p.name}</h5>
                    <h5 className="text-lg font-semibold text-green-600">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="mt-4">
                    <button
                      className="btn btn-info bg-green-600 text-white py-2 px-4 rounded-lg w-full hover:bg-green-700"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
