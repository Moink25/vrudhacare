import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ShoppingCart, Menu, X, User, LogOut, UserCog } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-10 w-auto"
                src="/vrudhacare-logo.png"
                alt="VrudhaCare Logo"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="hover:bg-emerald-600 px-3 py-2 rounded-md font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="hover:bg-emerald-600 px-3 py-2 rounded-md font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/donate"
                  className="hover:bg-emerald-600 px-3 py-2 rounded-md font-medium"
                >
                  Donate
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-emerald-600"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfile}
                      className="max-w-xs bg-emerald-600 rounded-full flex items-center text-sm focus:outline-none p-2"
                    >
                      {isAdmin ? (
                        <UserCog className="h-6 w-6" />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          Hello, {user?.name || "User"}
                          {isAdmin && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profile
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-3 px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-500"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <Link
              to="/cart"
              className="relative p-2 mr-2 rounded-full hover:bg-emerald-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-emerald-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/donate"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
              onClick={toggleMenu}
            >
              Donate
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-emerald-600"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
