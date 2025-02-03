import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Shop by Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div key={c._id} className="relative overflow-hidden rounded-lg shadow-lg group">
              <div className="bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out">
                <Link
                  to={`/category/${c.slug}`}
                  className="w-full h-full block p-6 text-center bg-white transform group-hover:scale-105 transition-transform duration-200"
                >
                  <h3 className="text-2xl font-semibold text-gray-900">{c.name}</h3>
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
