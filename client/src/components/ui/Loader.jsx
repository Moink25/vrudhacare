const Loader = ({ size = "medium", fullPage = false }) => {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  const spinnerClass = `${sizeClasses[size]} animate-spin rounded-full border-t-transparent border-emerald-600`;

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className={spinnerClass}></div>
    </div>
  );
};

export default Loader;
