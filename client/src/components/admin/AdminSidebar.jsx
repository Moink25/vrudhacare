import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin",
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/products",
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/admin/orders",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "Donations",
      icon: <Heart className="h-5 w-5" />,
      path: "/admin/donations",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-emerald-600 text-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={`bg-white shadow-md w-64 min-h-screen flex-shrink-0 fixed lg:static top-0 left-0 z-10 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-emerald-600">Admin Panel</h1>
          <p className="text-sm text-gray-500">VrudhaCare</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
