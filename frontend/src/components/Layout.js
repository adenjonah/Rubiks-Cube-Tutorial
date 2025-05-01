import React from 'react';
import Navbar from './Navbar';
import { Container } from '../styles/components';

/**
 * Layout component to wrap all pages with consistent styling
 * Restricted to 100vh height with no scrolling
 */
const Layout = ({ children, maxWidth = 'lg', className = '', ...props }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed height navbar */}
      <Navbar />
      
      {/* Main content with flex-grow and overflow handling */}
      <main className="flex-1 overflow-hidden bg-gray-100">
        <Container 
          maxWidth={maxWidth} 
          className={`h-full ${className}`} 
          fixedHeight
          {...props}
        >
          {children}
        </Container>
      </main>
      
      {/* Simple footer */}
      <footer className="bg-white py-2 text-center border-t border-gray-200">
        <div className="flex justify-center space-x-4">
          <span className="text-gray-500 text-sm">© {new Date().getFullYear()} Rubik's Cube Solver</span>
        </div>
        <div className="flex justify-center space-x-6 mt-1">
          <a href="/privacy" className="text-gray-500 hover:text-gray-700 text-xs no-underline">Privacy</a>
          <a href="/terms" className="text-gray-500 hover:text-gray-700 text-xs no-underline">Terms</a>
          <a href="/contact" className="text-gray-500 hover:text-gray-700 text-xs no-underline">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 