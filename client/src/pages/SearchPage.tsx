import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values, setValues] = useSearch();

  return (
    <Layout title={"Search Results"}>
      <div className="container mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Search Results</h1>
          <h6 className="mt-2 text-lg text-gray-600">
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length} products`}
          </h6>
        </div>
        <div className="flex flex-wrap justify-center mt-6">
          {values?.results.map((p) => (
            <div
              className="card m-4 p-4 w-64 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
              key={p._id}
            >
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top w-full h-48 object-cover rounded-md"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title text-xl font-semibold text-gray-800 mt-2">
                  {p.name}
                </h5>
                <p className="card-text text-gray-600 mt-2">
                  {p.description.substring(0, 30)}...
                </p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  ${p.price}
                </p>
                <div className="mt-4 flex justify-between">
                  <button className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    More Details
                  </button>
                  <button className="btn btn-secondary bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
