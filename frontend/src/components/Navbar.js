import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white flex-shrink-0 border-b border-gray-200">
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900 no-underline">
            Rubik's Cube Solver
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-12 items-center">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/learn/1">Learn</NavLink>
            <NavLink to="/quiz/1">Quiz</NavLink>
            <NavLink to="/cube">Cube</NavLink>
            <NavLink to="/style-guide">Style Guide</NavLink>
          </div>
        </div>
        
        {/* Mobile menu - absolute positioning to avoid pushing content */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200 absolute bg-white w-full left-0 shadow-md z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col space-y-2 pb-2">
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                <NavLink to="/learn/1" onClick={() => setIsMenuOpen(false)}>Learn</NavLink>
                <NavLink to="/quiz/1" onClick={() => setIsMenuOpen(false)}>Quiz</NavLink>
                <NavLink to="/cube" onClick={() => setIsMenuOpen(false)}>Cube</NavLink>
                <NavLink to="/style-guide" onClick={() => setIsMenuOpen(false)}>Style Guide</NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, children, onClick }) => (
  <Link 
    to={to} 
    className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors no-underline text-base"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar; 