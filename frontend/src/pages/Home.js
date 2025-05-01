import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CubeImageComparison from '../components/CubeImages';

const Home = () => {
  const navigate = useNavigate();

  const startLearning = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/start');
      navigate('/learn/1');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to connect to the backend server. Please make sure it is running on port 5000.');
    }
  };

  const goTo3DCube = () => {
    navigate('/cube');
  };

  const goTo2DCube = () => {
    navigate('/2dcube');
  };

  const showAbout = () => {
    // You can implement this to show an about modal or navigate to an about page
    alert('About this application: Learn to solve the white side of a Rubik\'s cube step by step.');
  };

  return (
    <div className="h-full flex flex-col items-center py-6 bg-gray-100">
      {/* Primary content group - centered both vertically and horizontally for dominant position */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-6">
        {/* Primary heading - largest size for highest importance */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Learn to Solve the White Side of a Rubik's Cube
        </h1>
        
        {/* Secondary text - smaller size, lighter color for secondary importance */}
        <div className="text-lg text-gray-600 mb-12 text-center max-w-2xl">
          Welcome to our interactive tutorial! We'll guide you through the process of solving 
          the white side of a Rubik's cube step by step.
        </div>
        
        {/* Visual focus - image comparison as central visual element */}
        <div className="mb-16 w-full flex justify-center">
          <CubeImageComparison />
        </div>
      </div>
      
      {/* Action group - placed at the bottom with clear visual hierarchy */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8 w-full max-w-2xl px-6">
        {/* Secondary action button */}
        <button
          onClick={showAbout}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors w-full sm:w-32 text-center shadow-sm"
        >
          About
        </button>
        
        {/* Primary action button - high contrast, larger size */}
        <button
          onClick={startLearning}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full sm:w-48 text-center font-medium shadow-md text-lg"
        >
          Start Learning!
        </button>
        
        {/* Secondary action button - 3D Cube */}
        <button
          onClick={goTo3DCube}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors w-full sm:w-32 text-center shadow-sm"
        >
          3D Cube
        </button>
        
        {/* Secondary action button - 2D Cube */}
        <button
          onClick={goTo2DCube}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors w-full sm:w-32 text-center shadow-sm"
        >
          2D Cube
        </button>
      </div>
    </div>
  );
};

export default Home; 