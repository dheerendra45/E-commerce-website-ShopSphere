import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react';
import SearchInput from '../SearchInput';
import { useAuth } from "../../context/Auth";  // Import useAuth hook

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State for managing dropdown visibility
  const navigate = useNavigate();

  // Use the useAuth hook to get authentication state and actions
  const [auth, setAuth] = useAuth();

  console.log('User:', auth.user);  // For debugging

  const logoutHandler = () => {
    setAuth({ user: null, token: "" });  // Clear auth data
    localStorage.removeItem('auth');  // Remove from localStorage
    navigate('/login');
  };

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ShopHub</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <SearchInput />
            <Link to="/categories" className="text-gray-700 hover:text-gray-900">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
            <Link to="/cart" className="text-gray-700 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {/* Stylish Dashboard and Admin Dropdown */}
      {/* User Dropdown */}
{/* User Dropdown */}
{auth.user ? (
  <div className="relative">
    <button
      onClick={toggleDropdown}
      className="text-gray-700 hover:text-gray-900 flex items-center space-x-1"
    >
      <span>{auth.user.name}</span>
    </button>

    {isDropdownOpen && (
      <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
        <button
          onClick={() => navigate(auth.user.role === 1 ? '/dashboard/admin' : '/dashboard')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition duration-150"
        >
          {auth.user.role === 1 ? "Admin Dashboard" : "Dashboard"}
        </button>

        <button
          onClick={logoutHandler}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition duration-150"
        >
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <button
    onClick={() => navigate('/register')}
    className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-150"
  >
    Register
  </button>
)}

          </div>


          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <SearchInput />
            <Link to="/categories" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">Categories</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">Contact</Link>
            <Link to="/cart" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">Cart</Link>

            {/* Dashboard and Admin in mobile menu */}
            {auth.user ? (
              <div className="block px-3 py-2 text-base font-medium text-gray-700">
                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Dashboard</Link>
                {auth.user.role === 1 && (
                  <Link to="/dashboard/admin" className="block px-3 py-2 text-gray-700 hover:text-gray-900">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="text-gray-700 hover:text-gray-900 ml-3"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
