import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import Loader from "../components/ui/Loader";
import { Heart, ShoppingCart } from "lucide-react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/api/products?featured=true&limit=4");
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Handcrafted with Care
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Support our elderly artisans by purchasing their handmade
              products. Each purchase brings joy and purpose to their lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-white text-emerald-700 font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/donate"
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-md hover:bg-white hover:text-emerald-700 transition"
              >
                Donate
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/hero-image.jpg"
              alt="Elderly hands making handcrafted items"
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400?text=Elderly+Crafting";
              }}
            />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            VrudhaCare aims to enhance the quality of life of our elderly
            residents by promoting their artistic skills and providing a
            platform to showcase their handmade creations to the world.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Care & Support</h3>
            <p className="text-gray-600">
              Our elderly residents receive 24/7 care and support while pursuing
              their passion for crafts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Quality Craftsmanship
            </h3>
            <p className="text-gray-600">
              Each product is carefully handcrafted with attention to detail and
              quality.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Financial Independence
            </h3>
            <p className="text-gray-600">
              Your purchase helps provide financial dignity and independence to
              our elderly artisans.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our collection of handmade products crafted with love by
              our talented elderly residents.
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/300x300?text=Product+Image";
                      }}
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-emerald-700 font-bold">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-emerald-700 text-white p-2 rounded-full hover:bg-emerald-600"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No featured products available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block bg-emerald-700 text-white font-semibold px-6 py-3 rounded-md hover:bg-emerald-600 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-emerald-700 text-white p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">Support Our Cause</h2>
                <p className="text-lg mb-6">
                  Your donations help us provide better facilities, healthcare,
                  and activities for our elderly residents. Every contribution,
                  no matter how small, makes a significant difference in their
                  lives.
                </p>
                <Link
                  to="/donate"
                  className="inline-block bg-white text-emerald-700 font-bold px-6 py-3 rounded-md hover:bg-gray-100 transition"
                >
                  Donate Now
                </Link>
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  How Your Donation Helps
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>
                      Provide quality healthcare and medications for residents
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Support craft materials and training programs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Organize recreational activities and outings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 mr-3 mt-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Improve living facilities and infrastructure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
