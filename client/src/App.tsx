import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PolicyPage from "./pages/PolicyPage";
import NotfoundPage from "./pages/NotfoundPage";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/SearchPage";
import ProductDetails from "./pages/ProductDetailsPage";
import Categories from "./pages/CategoriesPage";
import CategoryProduct from "./pages/CategoryProductPage";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />

        {/* Nested routes for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/user/orders" element={<Orders />} />
          <Route path="/dashboard/user/profile" element={<Profile />} />
        </Route>

        {/* Nested routes for admins */}
        <Route element={<AdminRoute />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/create-category" element={<CreateCategory />} />

          <Route path="/dashboard/admin/create-product" element={<CreateProduct />} />
          <Route path="/dashboard/admin/product/:slug" element={<UpdateProduct />} />
          <Route path="/dashboard/admin/products" element={<Products />} />
          <Route path="/dashboard/admin/users" element={<Users />} />
          <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="*" element={<NotfoundPage />} />
      </Routes>

      {/* Add Toaster for toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: 'green',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
}

export default App;