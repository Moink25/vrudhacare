import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Loader from "../components/ui/Loader";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, Home, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  // Calculated values
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost] = useState(50);
  const [total, setTotal] = useState(0);

  // Loading and steps
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Razorpay
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Calculate totals
  useEffect(() => {
    const calcSubtotal = getCartTotal();
    setSubtotal(calcSubtotal);
    setTotal(calcSubtotal + (calcSubtotal > 0 ? shippingCost : 0));
  }, [cartItems, getCartTotal, shippingCost]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      }));
    }
  }, [user]);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
    } else if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [isAuthenticated, cartItems.length, navigate, orderPlaced]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Required fields check
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please enter your ${field}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (formData.paymentMethod === "razorpay" && !razorpayLoaded) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          image: item.images && item.images[0] ? item.images[0] : null,
          price: item.price,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: "India",
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        totalPrice: total,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        user: user._id,
      };

      // Handle different payment methods
      if (formData.paymentMethod === "cod") {
        const response = await api.post("/api/orders", orderData);

        setOrderId(response.data._id);
        setOrderPlaced(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else if (formData.paymentMethod === "razorpay") {
        // Create Razorpay order first
        const response = await api.post("/api/payments/razorpay", {
          amount: total,
          currency: "INR",
          receipt: `order_rcpt_${Date.now()}`,
        });

        // Store order data in component state
        setRazorpayOrder({
          id: response.data.order.id,
          amount: response.data.order.amount,
          currency: response.data.order.currency,
          orderData,
        });

        // Open Razorpay with the order data
        handleRazorpayPayment(response.data.order, orderData);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = (razorpayData, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      name: "VrudhaCare",
      description: "Payment for your order",
      order_id: razorpayData.id,
      handler: async function (response) {
        try {
          console.log("Payment successful, verifying...");

          // Verify payment and create order
          const verifyResponse = await api.post(
            "/api/payments/razorpay/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData,
            }
          );

          setOrderId(verifyResponse.data._id);
          setOrderPlaced(true);
          clearCart();
          toast.success("Payment successful! Order placed.");
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#059669",
      },
      // Add a callback for when Razorpay modal is closed without payment
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast.error("Payment cancelled. Your order was not placed.");
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  // Order Success Page
  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been placed and is
              being processed.
            </p>
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Order ID:</p>
              <p className="font-medium text-gray-800">{orderId}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/profile")}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition"
              >
                Track Your Order
              </button>
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-white text-emerald-600 border border-emerald-600 py-2 px-4 rounded-md hover:bg-emerald-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handlePlaceOrder}>
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Home className="mr-2 h-5 w-5 text-emerald-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-emerald-600" />
                  Shipping Address
                </h2>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-emerald-600" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <label
                      htmlFor="cod"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="razorpay"
                      name="paymentMethod"
                      type="radio"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <label
                      htmlFor="razorpay"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Pay Online (Credit/Debit Card, UPI, Netbanking)
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="divide-y divide-gray-200">
                <ul className="space-y-4 pb-4">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={
                            item.images?.[0] ||
                            "https://placehold.co/100x100?text=Product+Image"
                          }
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/100x100?text=Product+Image";
                          }}
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-800">
                            <h3 className="line-clamp-1">{item.name}</h3>
                            <p className="ml-4">₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                          <p className="text-gray-700 font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">
                      Subtotal ({getCartCount()} items)
                    </p>
                    <p className="text-gray-800 font-medium">
                      ₹{subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-800 font-medium">
                      ₹{shippingCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="py-4">
                  <div className="flex justify-between text-base font-bold">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">₹{total.toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Taxes included where applicable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
