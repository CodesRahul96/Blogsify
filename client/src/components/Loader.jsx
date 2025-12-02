import 'react';
import Logo from '../assets/lettering.png';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black/80 backdrop-blur-md z-50">
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main loader content */}
      <div className="relative flex flex-col items-center justify-center space-y-6 z-10">
        {/* Logo with rotating border */}
        <div className="relative w-24 h-24">
          {/* Rotating gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full opacity-80 animate-spin"></div>
          
          {/* Inner circle with padding */}
          <div className="absolute inset-1 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center">
            {/* Logo image */}
            <img src={Logo} alt="Blogsify" className="w-16 h-16 object-contain animate-bounce" />
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex items-center justify-center space-x-3">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>

        {/* Loading text with gradient */}
        <div className="text-center space-y-2">
          <p className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 font-merriweather text-lg font-semibold tracking-wide">
            Loading
          </p>
          <p className="text-gray-400 font-merriweather text-sm">Preparing your content...</p>
        </div>
      </div>
    </div>
  );
}

export default Loader;