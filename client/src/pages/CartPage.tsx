import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";


const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [cToken, setCToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
  try {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== pid);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  } catch (e) {
    console.log(e);
  }
};


  // Get payment token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setCToken(data?.clientToken);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed");
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page p-4">
        <div className="text-center">
          <h1 className="bg-light p-2 mb-2 text-xl font-semibold">
            {!auth?.user
              ? "Hello Guest"
              : `Hello ${auth?.token && auth?.user?.name}`}
            <p className="text-sm mt-2">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout!"
                  }`
                : "Your Cart Is Empty"}
            </p>
          </h1>
        </div>
        <div className="container mx-auto">
          <div className="flex space-x-4">
            <div className="w-2/3 p-0">
              {cart?.map((p) => (
                <div className="flex items-center card my-3 p-4 border shadow-md" key={p._id}>
                  <div className="w-1/4">
                    <img
                      src={`http://localhost:8080/api/v1/product/get-photo/${p._id}`}
                      alt={p.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="w-1/2 pl-4">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm">{p.description.substring(0, 30)}</p>
                    <p className="font-semibold">Price: {p.price}</p>
                  </div>
                  <div className="w-1/4 flex justify-center items-center">
                    <button
                      className="btn btn-danger bg-red-600 text-white p-2 rounded hover:bg-red-700"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-1/3 p-4 border bg-gray-100 shadow-md">
              <h2 className="text-xl font-semibold">Cart Summary</h2>
              <p className="mt-2 text-sm">Total | Checkout | Payment</p>
              <hr className="my-2" />
              <h4 className="text-lg font-medium">Total: {totalPrice()}</h4>

              {auth?.user?.address ? (
                <div className="mt-4">
                  <h4 className="font-semibold">Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mt-2"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}

              <div className="mt-4">
                {!cToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: cToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-full mt-4"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
