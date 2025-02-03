import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 bg-white shadow-lg rounded-lg p-4">
              <UserMenu />
            </div>
            <div className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Name: {auth?.user?.name}</h3>
                <h3 className="text-xl font-semibold text-gray-700">Email: {auth?.user?.email}</h3>
                <h3 className="text-xl font-semibold text-gray-700">Address: {auth?.user?.address}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
