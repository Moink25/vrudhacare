import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Loader from "../components/ui/Loader";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Truck,
  Box,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
        setActiveImage(0);

        // Fetch related products
        const relatedResponse = await api.get(
          `/api/products?category=${response.data.category}&limit=4&exclude=${id}`
        );
        setRelatedProducts(relatedResponse.data.products);

        // Fetch reviews
        const reviewsResponse = await api.get(`/api/products/${id}/reviews`);
        setReviews(reviewsResponse.data);

        setError(null);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.countInStock || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.countInStock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleImageChange = (index) => {
    setActiveImage(index);
  };

  const handleNextImage = () => {
    if (product?.images?.length > 1) {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images?.length > 1) {
      setActiveImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      const response = await api.post(`/api/products/${id}/reviews`, review);
      setReviews([...reviews, response.data]);
      setReview({ rating: 5, comment: "" });
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  if (loading) return <Loader fullPage />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
        <div className="mt-4">
          <Link
            to="/products"
            className="text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-emerald-600">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-emerald-600">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium truncate">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-4">
              <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    product.images[activeImage] ||
                    "https://placehold.co/600x600?text=Product+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x600?text=Product+Image";
                  }}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-800 hover:bg-opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                        activeImage === index
                          ? "border-emerald-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={
                          image ||
                          "https://placehold.co/100x100?text=Product+Image"
                        }
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x100?text=Product+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-4 md:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(getAverageRating())
                          ? "fill-current"
                          : "stroke-current fill-transparent"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {getAverageRating()} ({reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-emerald-700">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ₹{product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{product.description}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Box className="h-5 w-5 mr-2 text-emerald-600" />
                    <span>
                      {product.countInStock > 0
                        ? `In Stock (${product.countInStock} available)`
                        : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Truck className="h-5 w-5 mr-2 text-emerald-600" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-2 text-emerald-600" />
                    <span>Delivery in 3-5 days</span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full capitalize mr-2">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-gray-200 text-gray-700 rounded-l-md px-3 py-2 border border-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.countInStock || 10}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="px-3 py-2 border-t border-b border-gray-300 text-center w-16"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="bg-gray-200 text-gray-700 rounded-r-md px-3 py-2 border border-gray-300"
                    disabled={quantity >= (product.countInStock || 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.countInStock <= 0}
                className={`flex items-center justify-center w-full py-3 px-6 rounded-md text-white font-medium ${
                  product.countInStock > 0
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Customer Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-600 mb-6">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="mb-8 space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-current"
                                  : "stroke-current fill-transparent"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-800">
                          {review.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Review Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Write a Review
              </h3>
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReview({ ...review, rating: star })}
                          className="text-yellow-400 focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= review.rating
                                ? "fill-current"
                                : "stroke-current fill-transparent"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      required
                      value={review.comment}
                      onChange={handleReviewChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Share your thoughts about this product..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 mb-2">
                    Please sign in to write a review.
                  </p>
                  <Link
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={
                        product.images[0] ||
                        "https://placehold.co/300x300?text=Product+Image"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/300x300?text=Product+Image";
                      }}
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 font-bold">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-emerald-700 text-white p-2 rounded-full hover:bg-emerald-600 transition"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Products */}
        <div>
          <Link
            to="/products"
            className="text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
