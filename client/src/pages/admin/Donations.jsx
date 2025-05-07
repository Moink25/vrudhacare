import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Download } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/donations");
      setDonations(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch donations");
      setLoading(false);
    }
  };

  const handleViewDetails = (donation) => {
    setCurrentDonation(donation);
    setShowDetailModal(true);
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

  const handleExportToCSV = () => {
    // Convert donations data to CSV format
    const headers = [
      "Donation ID",
      "Donor Name",
      "Email",
      "Amount",
      "Date",
      "Payment Method",
      "Status",
    ];

    const csvData = donations.map((donation) => [
      donation._id,
      donation.donorName,
      donation.email,
      donation.amount,
      formatDate(donation.createdAt),
      donation.paymentMethod,
      donation.status,
    ]);

    // Combine headers and data
    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `donations-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Donations exported successfully");
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
        <h1 className="text-2xl font-bold text-gray-800">
          Donation Management
        </h1>
        <button
          onClick={handleExportToCSV}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Download size={18} />
          Export to CSV
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {donation.donorName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{donation.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 font-semibold">
                    ₹{donation.amount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(donation.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      donation.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {donation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(donation)}
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

      {/* Donation Details Modal */}
      {showDetailModal && currentDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Donation Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Donation ID</p>
                <p className="font-medium">{currentDonation._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Donor Name</p>
                <p className="font-medium">{currentDonation.donorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentDonation.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {currentDonation.phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-lg">₹{currentDonation.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDate(currentDonation.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{currentDonation.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{currentDonation.status}</p>
              </div>
              {currentDonation.message && (
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="font-medium bg-gray-50 p-2 rounded">
                    {currentDonation.message}
                  </p>
                </div>
              )}
              {currentDonation.razorpayPaymentId && (
                <div>
                  <p className="text-sm text-gray-500">Razorpay Payment ID</p>
                  <p className="font-medium font-mono text-sm">
                    {currentDonation.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonations;
