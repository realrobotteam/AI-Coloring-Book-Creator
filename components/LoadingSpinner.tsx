
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500 mx-auto"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Our art-bots are drawing your pages...</p>
      <p className="text-gray-500">This can take a moment, please wait!</p>
    </div>
  );
};

export default LoadingSpinner;
