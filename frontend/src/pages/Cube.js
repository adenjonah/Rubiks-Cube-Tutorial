import React from 'react';
import RubiksCube3D from '../components/RubiksCube3D';

const Cube = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">3D Rubik's Cube</h1>
      
      <div className="flex justify-center">
        <RubiksCube3D />
      </div>
      
      <div className="mt-6 max-w-2xl mx-auto text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Standard Color Scheme</h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p><span className="inline-block w-4 h-4 mr-2 bg-red-600"></span><strong>Red</strong> - Front face</p>
            <p><span className="inline-block w-4 h-4 mr-2 bg-orange-500"></span><strong>Orange</strong> - Back face</p>
            <p><span className="inline-block w-4 h-4 mr-2 bg-blue-600"></span><strong>Blue</strong> - Right face</p>
          </div>
          <div>
            <p><span className="inline-block w-4 h-4 mr-2 bg-green-600"></span><strong>Green</strong> - Left face</p>
            <p><span className="inline-block w-4 h-4 mr-2 bg-white border border-gray-300"></span><strong>White</strong> - Up face</p>
            <p><span className="inline-block w-4 h-4 mr-2 bg-yellow-400"></span><strong>Yellow</strong> - Down face</p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Keyboard Controls</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>F</strong> - Front face clockwise</p>
            <p><strong>B</strong> - Back face clockwise</p>
            <p><strong>L</strong> - Left face clockwise</p>
            <p><strong>R</strong> - Right face clockwise</p>
            <p><strong>U</strong> - Up face clockwise</p>
            <p><strong>D</strong> - Down face clockwise</p>
          </div>
          <div>
            <p><strong>Shift+F</strong> - Front face counter-clockwise</p>
            <p><strong>Shift+B</strong> - Back face counter-clockwise</p>
            <p><strong>Shift+L</strong> - Left face counter-clockwise</p>
            <p><strong>Shift+R</strong> - Right face counter-clockwise</p>
            <p><strong>Shift+U</strong> - Up face counter-clockwise</p>
            <p><strong>Shift+D</strong> - Down face counter-clockwise</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cube; 