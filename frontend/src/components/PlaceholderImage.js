import React from 'react';

const PlaceholderImage = ({ alt, className }) => {
  return (
    <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
      <div className="text-center p-4">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{alt || 'Image placeholder'}</p>
        <p className="mt-1 text-xs text-gray-500">Please add the actual image file</p>
      </div>
    </div>
  );
};

export default PlaceholderImage; 