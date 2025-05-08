import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const navigate = useNavigate();

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    maker: "",
    story: "",
    featured: false,
    images: [
      {
        url: "",
        public_id: "",
      },
    ],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/products");
      if (response.data.products) {
        setProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setProducts([]);
        toast.error("Failed to parse products data");
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock || 0,
      maker: product.maker || "",
      story: product.story || "",
      featured: product.featured || false,
      images:
        product.images && product.images.length > 0
          ? product.images
          : [
              {
                url: "",
                public_id: "",
              },
            ],
    });
    setShowEditModal(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      maker: "",
      story: "",
      featured: false,
      images: [
        {
          url: "",
          public_id: "",
        },
      ],
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "stock"
          ? Number(value)
          : value,
    });
  };

  const handleImageChange = (e, index = 0) => {
    const newImages = [...formData.images];
    newImages[index] = {
      ...newImages[index],
      url: e.target.value,
      public_id: e.target.value.split("/").pop(),
    };
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleFileUpload = async (e, index = 0) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create loading toast
    const loadingToast = toast.loading("Uploading image...");

    try {
      // Create form data for file upload
      const uploadData = new FormData();
      uploadData.append("image", file);

      // Upload image
      const response = await api.post("/api/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update state with the uploaded image URL
      const newImages = [...formData.images];
      newImages[index] = {
        url: response.data.url,
        public_id: response.data.public_id,
      };

      setFormData((prevData) => ({
        ...prevData,
        images: newImages,
      }));

      toast.dismiss(loadingToast);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.dismiss(loadingToast);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", public_id: "" }],
    });
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        images: newImages,
      });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/products", formData);
      toast.success("Product added successfully");
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${currentProduct._id}`, formData);
      toast.success("Product updated successfully");
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product");
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={handleAddClick}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={
                      (product.images && product.images[0]?.url) ||
                      "https://placehold.co/300x300?text=Product+Image"
                    }
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x300?text=Product+Image";
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">₹{product.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="text-emerald-600 hover:text-emerald-900 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form
              onSubmit={handleAddSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Art & Craft">Art & Craft</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Maker (Resident)
                </label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 text-gray-700 text-sm font-bold"
                  >
                    Featured Product
                  </label>
                </div>
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Story (Optional)
                </label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="mb-2 border rounded p-3">
                      {image.url ? (
                        <div className="mb-2">
                          <img
                            src={image.url}
                            alt={`Preview ${index}`}
                            className="h-32 w-full object-cover rounded mb-2"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">
                            Upload:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, index)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">
                            URL:
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste image URL"
                            value={image.url}
                            onChange={(e) => handleImageChange(e, index)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            disabled={formData.images.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="bg-emerald-600 text-white px-3 py-1 rounded mt-3"
                >
                  + Add Image
                </button>
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Art & Craft">Art & Craft</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Maker (Resident)
                </label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    id="featured-edit"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="featured-edit"
                    className="ml-2 text-gray-700 text-sm font-bold"
                  >
                    Featured Product
                  </label>
                </div>
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Story (Optional)
                </label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Images
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="mb-2 border rounded p-3">
                      {image.url ? (
                        <div className="mb-2">
                          <img
                            src={image.url}
                            alt={`Preview ${index}`}
                            className="h-32 w-full object-cover rounded mb-2"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">
                            Upload:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, index)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">
                            URL:
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste image URL"
                            value={image.url}
                            onChange={(e) => handleImageChange(e, index)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            disabled={formData.images.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addImageField}
                  className="bg-emerald-600 text-white px-3 py-1 rounded mt-3"
                >
                  + Add Image
                </button>
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
