import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Loader from "../../components/ui/Loader";
import {
  ShoppingBag,
  Users,
  Gift,
  DollarSign,
  TrendingUp,
  Package,
  Truck,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalDonations: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes, usersRes] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/orders/recent"),
          api.get("/api/admin/users/recent"),
        ]);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setRecentUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader fullPage />;

  // Format to Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-emerald-100 p-3 mr-4">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalOrders}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalUsers}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalProducts}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <Gift className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Donations</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalDonations}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.pendingOrders}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Monthly Growth</p>
              <h3 className="text-2xl font-bold text-gray-800">+12%</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-800">5</h3>
            </div>
          </div>
        </div>

        {/* Recent Orders & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          Order #{order._id.substring(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(order.createdAt)} •{" "}
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.isDelivered
                            ? "bg-green-100 text-green-800"
                            : order.isPaid
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isDelivered
                          ? "Delivered"
                          : order.isPaid
                          ? "Paid"
                          : "Processing"}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{order.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent orders to display.
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Users
              </h2>
              <Link
                to="/admin/users"
                className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-gray-200">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-emerald-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No recent users to display.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
