import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { toast } from 'react-toastify';

const priceRanges = [
  { id: 1, label: 'Under $50', value: '0-50' },
  { id: 2, label: '$50 - $100', value: '50-100' },
  { id: 3, label: '$100 - $200', value: '100-200' },
  { id: 4, label: '$200+', value: '200-999999' },
];

export function Filters({ setProducts, page, setLoading }) {
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    price: false,
  });

  const getAuthHeaders = () => {
    const token = JSON.parse(localStorage.getItem('auth'))?.token;
    if (!token) {
      toast.error('❌ Please log in first.');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const getAllCategory = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const { data } = await axios.get('http://localhost:8080/api/v1/category/get-category', { headers });
      if (data?.success) {
        setCategories(data.categories);
      } else {
        toast.error(data?.message || 'Error fetching categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Something went wrong while fetching categories');
    }
  };

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
    getAllCategory();
  }, []);

  useEffect(() => {
    if (checked.length === 0 && !radio) {
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const { data } = await axios.post(
        'http://localhost:8080/api/v1/product/product-filters',
        { checked, radio },
        { headers }
      );
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-list/${page}`,
        { headers }
      );
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilter = (value, id) => {
    setChecked((prevChecked) =>
      value ? [...prevChecked, id] : prevChecked.filter((c) => c !== id)
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-4 p-4">
        <div className="flex items-center">
          <Sliders className="h-5 w-5 mr-2 text-gray-500" />
          <span className="font-semibold text-gray-900">Filters:</span>
        </div>

        <div className="relative">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-700">Categories</span>
            {expandedSections.categories ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {expandedSections.categories && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked.includes(category._id)}
                    onChange={(e) => handleFilter(e.target.checked, category._id)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-700">Price Range</span>
            {expandedSections.price ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {expandedSections.price && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2">
              {priceRanges.map((range) => (
                <label key={range.id} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="price-range"
                    value={range.value}
                    checked={radio === range.value}
                    onChange={(e) => setRadio(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={filterProduct}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
