import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";

const Users = () => {
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid mx-auto p-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 p-4">
            <AdminMenu />
          </div>
          <div className="w-full md:w-3/4 p-4">
            <h1 className="text-2xl font-bold mb-6">All Users</h1>
            {/* Add your user list or table here */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-700">
                This is where you can manage all users. Add a table or list to display user data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;