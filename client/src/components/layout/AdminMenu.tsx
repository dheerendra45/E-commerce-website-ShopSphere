import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="text-center bg-gray-900 text-white rounded-lg p-6 shadow-md">
      <h4 className="text-xl font-semibold mb-4 text-purple-400">Admin Panel</h4>
      <div className="space-y-2">
        <NavLink
          to="/dashboard/admin/create-category"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white transition"
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white transition"
        >
          Create Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/products"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white transition"
        >
          Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white transition"
        >
          Orders
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
