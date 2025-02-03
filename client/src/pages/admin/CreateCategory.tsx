import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";  // Ensure this is imported

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // Form submission handler
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting category:", name);  // Debugging

      const token = JSON.parse(localStorage.getItem("auth"))?.token;
      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure JSON is sent
      };

      const res = await axios.post(
        "http://localhost:8080/api/v1/category/create-category",
        { name }, // Send correctly formatted request
        { headers }
      );

      console.log("Server response:", res.data); // Debugging

      if (res?.data?.success) {
        toast.success("✅ Category created successfully!");
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("❌ Something went wrong");
    }
};

 const getAllCategory = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("auth"))?.token;
    console.log("Token retrieved during getCategories:", token);

    if (!token) {
      toast.error("❌ Please log in first.");
      return;
    }

   const headers = {
       Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      "http://localhost:8080/api/v1/category/get-category",
      { headers }
    );

    console.log("Full Response from Backend:", response);
    console.log("Backend Response Data:", response.data);

    if (response.data?.success) {
      console.log("Categories received:", response.data.categories); // Corrected key
      setCategories(response.data.categories); // Corrected key
    } else {
      console.log("Error Message from Backend:", response.data.message);
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log("Error fetching categories:", error.response?.data || error.message);
    toast.error("Something went wrong in getting category");
  }
};


  useEffect(() => {
    getAllCategory();
  }, []);

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("auth"))?.token; // Retrieve token from localStorage
      console.log("Token retrieved during update:", token); // Log token

      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
      };

      const { data } = await axios.put(
        `http://localhost:8080/api/v1/category/update-category/${selected._id}`,
        { name: updatedName },
        { headers } // Include headers here
      );

      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
         window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Delete Category
  const handleDelete = async (pId) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"))?.token; // Retrieve token from localStorage
      console.log("Token retrieved during delete:", token); // Log token

      if (!token) {
        toast.error("❌ Please log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
      };

      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/category/delete-category/${pId}`,
        { headers } // Include headers here
      );

      if (data.success) {
        toast.success("Category is deleted");
        getAllCategory();
         window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Manage Category"}>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <AdminMenu />
          </div>
          <div className="col-span-9 bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-semibold mb-4">Manage Category</h1>
            <div className="mb-4">
              <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id} className="border-t">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
              <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
