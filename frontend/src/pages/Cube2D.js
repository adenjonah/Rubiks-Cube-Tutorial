import React from 'react';
import RubiksCube from '../components/RubiksCube';
import Layout from '../components/Layout';

const Cube2D = () => {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-3">Interactive Rubik's Cube</h1>
        <div className="mb-4 text-gray-600 text-sm">
          <p className="mb-2">This 2D cube simulation accurately demonstrates how permutations occur during rotations:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>The rotating face turns completely</li>
            <li>The opposite face stays unchanged</li>
            <li>The four adjacent faces each have their touching edges affected</li>
          </ul>
          <p>The visualization highlights changed pieces after each move.</p>
        </div>
        <RubiksCube />
      </div>
    </Layout>
  );
};

export default Cube2D; 