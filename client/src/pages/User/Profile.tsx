import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 bg-white shadow-lg rounded-lg p-6">
              <UserMenu />
            </div>
            <div className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-center mb-6">User Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input w-full p-3 border rounded-md"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input w-full p-3 border rounded-md"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input w-full p-3 border rounded-md"
                    placeholder="Enter Your Password"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input w-full p-3 border rounded-md"
                    placeholder="Enter Your Phone"
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input w-full p-3 border rounded-md"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
