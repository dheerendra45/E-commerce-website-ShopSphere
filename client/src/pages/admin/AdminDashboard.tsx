import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/Auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Admin Dashboard</h2>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-lg mb-2">
                <span className="font-semibold text-blue-300">Admin Name:</span> {auth?.user?.name}
              </h3>
              <h3 className="text-lg mb-2">
                <span className="font-semibold text-blue-300">Admin Email:</span> {auth?.user?.email}
              </h3>
              <h3 className="text-lg">
                <span className="font-semibold text-blue-300">Admin Contact:</span> {auth?.user?.phone}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
