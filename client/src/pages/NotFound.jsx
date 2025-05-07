import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-full max-w-md">
        <div className="text-6xl font-bold text-gray-900 mb-2">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
