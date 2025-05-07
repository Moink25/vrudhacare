import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import Loader from "../components/ui/Loader";
import {
  Heart,
  User,
  Mail,
  Phone,
  DollarSign,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const Donation = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donationId, setDonationId] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    amount: 500,
    message: "",
    anonymous: false,
  });

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    // Required fields check
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.amount
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    // Amount validation
    if (formData.amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!razorpayLoaded) {
      toast.error("Payment system is loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const response = await api.post("/api/payments/razorpay", {
        amount: Number(formData.amount),
        currency: "INR",
        receipt: `donation_${Date.now()}`,
      });

      // Extract the order data from the response
      const razorpayData = response.data.order || response.data;
      console.log("Razorpay order data:", razorpayData);

      // Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "VrudhaCare",
        description: "Donation to support elderly artisans",
        order_id: razorpayData.id,
        handler: async function (response) {
          try {
            // Verify payment and create donation record
            const verifyResponse = await api.post("/api/donations", {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              amount: Number(formData.amount),
              message: formData.message,
              anonymous: formData.anonymous,
              paymentId: response.razorpay_payment_id,
            });

            setDonationId(verifyResponse.data.donation?._id || "N/A");
            setSuccess(true);
            toast.success("Thank you for your donation!");
          } catch (error) {
            console.error("Donation verification failed:", error);
            toast.error(
              "Donation verification failed. Please contact support."
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#059669",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating donation:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process donation. Please try again."
      );
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  // Success Page after donation
  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Donation Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your generous donation. Your contribution will make
              a significant difference in the lives of our elderly residents.
            </p>
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Donation ID:</p>
              <p className="font-medium text-gray-800">{donationId}</p>
            </div>
            <p className="text-emerald-600 font-medium">
              We've sent a confirmation email to {formData.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Support Our Cause
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your donation helps provide better facilities, healthcare, and
            activities for our elderly residents. Every contribution makes a
            significant difference in their lives.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Donation Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Heart className="mr-2 h-6 w-6 text-red-500" />
                Make a Donation
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donation Amount */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Donation Amount (₹)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        min="100"
                        value={formData.amount}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, amount }))
                          }
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            Number(formData.amount) === amount
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Add a message of support..."
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Anonymous Donation */}
                  <div className="flex items-center">
                    <input
                      id="anonymous"
                      name="anonymous"
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="anonymous"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Make this donation anonymous
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 transition"
                  >
                    Donate Now
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Your donation is secure and encrypted. By donating, you
                    agree to our terms and conditions.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Donation Impact */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Your Donation Makes a Difference
              </h2>

              <div className="space-y-6">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-emerald-800 mb-2">
                    How We Use Your Donations
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
                        <strong>Healthcare:</strong> Provide quality healthcare
                        and medications for residents
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
                      <span>
                        <strong>Craft Materials:</strong> Support craft
                        materials and training programs
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
                      <span>
                        <strong>Activities:</strong> Organize recreational
                        activities and outings
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
                      <span>
                        <strong>Infrastructure:</strong> Improve living
                        facilities and infrastructure
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Recent Donations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Rajesh S.
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹2,000 • 3 days ago
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          "Keep up the great work!"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Anonymous
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹5,000 • 1 week ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          Priya M.
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹1,000 • 2 weeks ago
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          "Supporting our elders is so important. Thank you for
                          your service."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Tax Benefits
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your donation is eligible for tax benefits under Section 80G
                    of the Income Tax Act. We'll send you a donation receipt via
                    email for tax purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
