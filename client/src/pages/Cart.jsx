import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBasket,
} from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shippingCost] = useState(50);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calcSubtotal = getCartTotal();
    setSubtotal(calcSubtotal);
    setTotal(calcSubtotal + (calcSubtotal > 0 ? shippingCost : 0));
  }, [cartItems, getCartTotal, shippingCost]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8 text-emerald-600" />
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBasket className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item._id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0 flex-shrink-0">
                          <img
                            src={
                              item.images && item.images[0]?.url
                                ? item.images[0].url
                                : "https://placehold.co/100x100?text=Product+Image"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/100x100?text=Product+Image";
                            }}
                          />
                        </div>
                        <div className="sm:ml-6 sm:flex-1">
                          <div className="flex justify-between">
                            <div className="pr-6">
                              <h3 className="text-lg font-medium text-gray-800">
                                <Link
                                  to={`/product/${item._id}`}
                                  className="hover:text-emerald-600"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                {item.description}
                              </p>
                              <p className="mt-1 text-sm font-medium text-emerald-700">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="flex border border-gray-300 rounded-md">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-r border-gray-300"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-1 bg-white flex items-center justify-center min-w-[40px]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-l border-gray-300"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="ml-4 text-red-500 hover:text-red-700"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <p className="text-sm font-medium text-gray-700 mt-2 sm:mt-0">
                              Subtotal: ₹
                              {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2 transform rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-base font-medium text-gray-700">
                    <p>Subtotal ({getCartCount()} items)</p>
                    <p>₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-700">
                    <p>Shipping</p>
                    <p>
                      {subtotal > 0 ? `₹${shippingCost.toFixed(2)}` : "Free"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <p>Total</p>
                    <p>₹{total.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full mt-6 flex items-center justify-center py-3 px-4 rounded-md text-white font-medium ${
                    cartItems.length > 0
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                {!isAuthenticated && cartItems.length > 0 && (
                  <p className="text-sm text-gray-600 text-center mt-4">
                    You'll need to{" "}
                    <Link
                      to="/login?redirect=checkout"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      login
                    </Link>{" "}
                    before checkout.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
