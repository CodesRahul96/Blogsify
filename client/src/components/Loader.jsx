function Loader() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm z-50">
        <div className="relative flex items-center justify-center">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent"></div>
          
          {/* Optional Pulse Effect */}
          <div className="absolute w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Loading Text */}
          <span className="absolute text-gray-200 font-merriweather text-lg font-semibold animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  
  export default Loader;