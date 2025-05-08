import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import Loader from "../components/ui/Loader";
import { Package, Truck, Clock, CheckCircle, ArrowLeft } from "lucide-react";

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders/${id}`);
        if (response.data && (response.data.order || response.data)) {
          setOrder(response.data.order || response.data);
        } else {
          toast.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const getStatusStep = () => {
    if (order.status === "Cancelled") {
      return -1; // Special case
    } else if (order.status === "Delivered") {
      return 3;
    } else if (order.status === "Shipped") {
      return 2;
    } else if (order.status === "Processing") {
      return 1;
    } else {
      return 0; // Pending
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't find the order you're looking for.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to your orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to your orders
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order._id.substring(0, 8)}
              </h1>
              <div className="mt-2 sm:mt-0">
                <p className="text-sm text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Status
            </h2>

            {currentStep === -1 ? (
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      This order has been cancelled
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: `${(currentStep / 3) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 0
                        ? "text-emerald-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`rounded-full p-1 ${
                        currentStep >= 0
                          ? "bg-emerald-100 text-emerald-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Clock size={16} />
                    </div>
                    <span className="mt-1">Pending</span>
                  </div>

                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 1
                        ? "text-emerald-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`rounded-full p-1 ${
                        currentStep >= 1
                          ? "bg-emerald-100 text-emerald-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Package size={16} />
                    </div>
                    <span className="mt-1">Processing</span>
                  </div>

                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 2
                        ? "text-emerald-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`rounded-full p-1 ${
                        currentStep >= 2
                          ? "bg-emerald-100 text-emerald-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Truck size={16} />
                    </div>
                    <span className="mt-1">Shipped</span>
                  </div>

                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 3
                        ? "text-emerald-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`rounded-full p-1 ${
                        currentStep >= 3
                          ? "bg-emerald-100 text-emerald-500"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle size={16} />
                    </div>
                    <span className="mt-1">Delivered</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium">{order.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-1">Phone: {order.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Order Information
                </h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {order.paymentMethod === "cod"
                        ? "Cash On Delivery"
                        : "Online Payment"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Payment Status:</span>
                    <span
                      className={`font-medium ${
                        order.isPaid ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Status:</span>
                    <span
                      className={`font-medium ${
                        order.isDelivered ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "In Transit"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id || item.product}
                  className="flex items-center border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100?text=Product+Image";
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900">
                      <Link
                        to={`/product/${item.product}`}
                        className="hover:text-emerald-600"
                      >
                        {item.name}
                      </Link>
                    </h3>
                    <div className="mt-1 flex text-sm text-gray-500">
                      <p>
                        Quantity: {item.quantity} × ₹{item.price.toFixed(2)} = ₹
                        {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹{order.itemsPrice.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹{order.shippingPrice.toFixed(2)}
                  </dd>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Tax</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹{order.taxPrice.toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    ₹{order.totalPrice.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
