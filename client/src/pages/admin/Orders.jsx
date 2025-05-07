import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      setShowDetailModal(false);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {order.user ? order.user.name : "Guest"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    ₹{order.totalPrice}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetailModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{currentOrder._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDate(currentOrder.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">
                  {currentOrder.user ? currentOrder.user.name : "Guest"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {currentOrder.user ? currentOrder.user.email : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{currentOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium">
                  {currentOrder.isPaid ? "Paid" : "Not Paid"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="bg-gray-50 p-3 rounded">
                <p>{currentOrder.shippingAddress.address}</p>
                <p>
                  {currentOrder.shippingAddress.city},{" "}
                  {currentOrder.shippingAddress.state} -{" "}
                  {currentOrder.shippingAddress.postalCode}
                </p>
                <p>{currentOrder.shippingAddress.country}</p>
                <p>Phone: {currentOrder.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-3 rounded divide-y divide-gray-200">
                {currentOrder.orderItems.map((item) => (
                  <div key={item._id} className="py-2 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Items Price</p>
                <p className="font-medium">₹{currentOrder.itemsPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipping Price</p>
                <p className="font-medium">₹{currentOrder.shippingPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax</p>
                <p className="font-medium">₹{currentOrder.taxPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold">Total</p>
                <p className="font-bold text-lg">₹{currentOrder.totalPrice}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Update Order Status</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(currentOrder._id, "Processing")
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Processing
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(currentOrder._id, "Shipped")
                  }
                  className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Shipped
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(currentOrder._id, "Delivered")
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  <CheckCircle size={14} />
                  Delivered
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(currentOrder._id, "Cancelled")
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
