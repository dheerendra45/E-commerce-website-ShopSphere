import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <div className="text-center bg-gray-900 text-white rounded-lg p-6 shadow-md">
      <h4 className="text-xl font-semibold mb-4 text-blue-400">User Dashboard</h4>
      <div className="space-y-2">
        <NavLink
          to="/dashboard/user/profile"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white transition"
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className="block px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white transition"
        >
          Orders
        </NavLink>
      </div>
    </div>
  );
};

export default UserMenu;
