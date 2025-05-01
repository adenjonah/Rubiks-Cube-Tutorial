import React from 'react';

/**
 * Custom component to display the cube images side by side with an arrow
 * Follows information hierarchy principles with proper sizing, spacing and contrast
 */
export const CubeImageComparison = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center">
      {/* Before image - slightly smaller to indicate starting point */}
      <div className="relative w-64 h-64 md:h-72 md:w-72 flex items-center justify-center p-2 bg-white rounded-md shadow-sm">
        <span className="absolute -top-6 left-0 text-sm text-gray-500 font-medium">Before</span>
        <img 
          src="/images/Scrambled.jpg" 
          alt="Scrambled Rubik's Cube" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Visual flow indicator with directional cue */}
      <div className="mx-6 md:mx-8 my-4 md:my-0 transform rotate-0">
        <svg width="110" height="60" viewBox="0 0 110 60" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="25" width="70" height="10" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <path d="M110 30L70 55L70 5L110 30Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
        </svg>
      </div>
      
      {/* After image - highlighted with stronger shadow to show goal state */}
      <div className="relative w-64 h-64 md:h-72 md:w-72 flex items-center justify-center p-2 bg-white rounded-md shadow-md border-2 border-gray-200">
        <span className="absolute -top-6 left-0 text-sm text-gray-500 font-medium">After</span>
        <img 
          src="/images/WhiteSide.jpg" 
          alt="Solved White Side" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default CubeImageComparison; 