import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="All Orders Data">
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <AdminMenu />
          </div>

          {/* Orders Section */}
          <div className="md:col-span-3">
            <h1 className="text-2xl font-semibold text-blue-400 mb-4 text-center">
              All Orders
            </h1>

            {orders?.map((o, i) => (
              <div key={o._id} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-blue-300">
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Buyer</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-600">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td className="p-3">{o?.buyer?.name}</td>
                      <td className="p-3">{moment(o?.createdAt).fromNow()}</td>
                      <td className="p-3">
                        {o?.payment.success ? (
                          <span className="text-green-400">Success</span>
                        ) : (
                          <span className="text-red-400">Failed</span>
                        )}
                      </td>
                      <td className="p-3">{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Products List */}
                <div className="mt-4">
                  {o?.products?.map((p, i) => (
                    <div key={p._id} className="flex items-center bg-gray-700 p-4 rounded-lg mb-3">
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <p className="text-lg font-semibold">{p.name}</p>
                        <p className="text-gray-400">{p.description.substring(0, 30)}</p>
                        <p className="text-yellow-400 font-bold">Price: ₹{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
