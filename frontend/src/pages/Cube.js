import React from 'react';
import RubiksCube from '../components/RubiksCube';

const Cube = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Rubik's Cube</h1>
      <div className="flex justify-center">
        <RubiksCube />
      </div>
    </div>
  );
};

export default Cube; 