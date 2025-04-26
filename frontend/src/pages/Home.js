import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Learn to Solve the White Side of a Rubik's Cube</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to our interactive tutorial! We'll guide you through the process of solving the white side of a Rubik's cube step by step.
        </p>
        <div className="flex justify-center mb-8">
          <img 
            src="/images/Scrambled.jpg" 
            alt="Scrambled Rubik's Cube" 
            className="rounded-lg shadow-lg max-w-md w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>Understanding the structure of a Rubik's Cube</li>
          <li>Identifying the white edges and corners</li>
          <li>Solving the white cross</li>
          <li>Placing the white corners correctly</li>
          <li>Basic algorithms and cube notation</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <ol className="list-decimal ml-6 text-gray-700 space-y-2">
          <li>Go through each learning module at your own pace</li>
          <li>Practice with interactive examples</li>
          <li>Test your knowledge with the quiz</li>
          <li>Apply what you've learned on a real Rubik's Cube</li>
        </ol>
      </div>

      <div className="text-center">
        <button
          onClick={startLearning}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 transform hover:scale-105"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default Home; 