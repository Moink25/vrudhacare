import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import Loader from "../components/ui/Loader";
import {
  ShoppingCart,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Search,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Filtering state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(8);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/products/categories");
        console.log("Categories response:", response.data);
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryParams = new URLSearchParams();
        queryParams.append("page", currentPage);
        queryParams.append("limit", productsPerPage);

        if (selectedCategory) queryParams.append("category", selectedCategory);
        if (priceRange.min) queryParams.append("minPrice", priceRange.min);
        if (priceRange.max) queryParams.append("maxPrice", priceRange.max);
        if (sortBy) queryParams.append("sort", sortBy);
        if (searchQuery) queryParams.append("search", searchQuery);

        const response = await api.get(
          `/api/products?${queryParams.toString()}`
        );
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / productsPerPage));
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    selectedCategory,
    priceRange,
    sortBy,
    searchQuery,
    productsPerPage,
  ]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceChange = (e, bound) => {
    const value = e.target.value;
    setPriceRange((prev) => ({
      ...prev,
      [bound]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

        {/* Search Form - Mobile & Desktop */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Section - Mobile Toggle */}
          <button
            className="md:hidden flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            onClick={toggleFilter}
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </span>
            {filterOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {/* Filter Section - Desktop & Mobile (when open) */}
          <div
            className={`${filterOpen ? "block" : "hidden"} md:block md:w-1/4`}
          >
            <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                {(selectedCategory ||
                  priceRange.min ||
                  priceRange.max ||
                  sortBy !== "newest" ||
                  searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear All
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Categories
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="all-categories"
                      name="category"
                      type="radio"
                      checked={selectedCategory === ""}
                      onChange={() => handleCategoryChange("")}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="all-categories"
                      className="ml-2 text-sm text-gray-700"
                    >
                      All Categories
                    </label>
                  </div>

                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        name="category"
                        type="radio"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm text-gray-700 capitalize"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </h3>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label htmlFor="min-price" className="sr-only">
                      Minimum Price
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="max-price" className="sr-only">
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
              </div>

              {/* Apply Button (Mobile Only) */}
              <button
                className="md:hidden mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                onClick={toggleFilter}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            to={`/product/${product._id}`}
                            className="block"
                          >
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-emerald-600 transition">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full capitalize">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-700 font-bold">
                            ₹{product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="bg-emerald-700 text-white p-2 rounded-full hover:bg-emerald-600 transition"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Previous
                      </button>

                      {[...Array(totalPages).keys()].map((page) => (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page + 1
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {page + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-lg text-gray-600 mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
