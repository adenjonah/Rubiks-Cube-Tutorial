import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Rubik's Cube Solver
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/learn/1" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500">
              Learn
            </Link>
            <Link to="/quiz/1" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500">
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 