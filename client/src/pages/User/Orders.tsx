import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Your Orders"}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4 bg-white shadow-lg rounded-lg p-4">
              <UserMenu />
            </div>
            <div className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-2xl font-semibold text-center mb-6">All Orders</h1>
              {orders?.map((o, i) => (
                <div className="border border-gray-300 shadow-lg rounded-lg mb-6">
                  <table className="table-auto w-full text-sm text-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Buyer</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Payment</th>
                        <th className="px-4 py-2 text-left">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{o?.status}</td>
                        <td className="px-4 py-2">{o?.buyer?.name}</td>
                        <td className="px-4 py-2">{moment(o?.createAt).fromNow()}</td>
                        <td className="px-4 py-2">{o?.payment.success ? "Success" : "Failed"}</td>
                        <td className="px-4 py-2">{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="space-y-4 mt-4">
                    {o?.products?.map((p) => (
                      <div
                        className="flex flex-row gap-4 bg-gray-50 p-4 rounded-lg shadow-md"
                        key={p._id}
                      >
                        <div className="w-1/4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                        <div className="w-3/4">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-gray-600 text-sm">{p.description.substring(0, 30)}...</p>
                          <p className="font-bold text-gray-800">Price: ${p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
