import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RubiksCube.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Expected state after one F rotation (for testing)
const EXPECTED_STATE_AFTER_F = [
  ['green', 'green', 'yellow', 'green', 'green', 'yellow', 'green', 'green', 'yellow'],  // face 0 (Left - Green) - right column changed
  ['white', 'blue', 'blue', 'white', 'blue', 'blue', 'white', 'blue', 'blue'],  // face 1 (Right - Blue) - left column changed
  ['white', 'white', 'white', 'white', 'white', 'white', 'green', 'green', 'green'],  // face 2 (Top - White) - bottom row changed
  ['blue', 'blue', 'blue', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],  // face 3 (Bottom - Yellow) - top row changed
  ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],  // face 4 (Front - Red, rotated)
  ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']  // face 5 (Back - Orange) - unchanged
];

// Expected state after one F' rotation (for testing)
const EXPECTED_STATE_AFTER_F_PRIME = [
  ['green', 'green', 'white', 'green', 'green', 'white', 'green', 'green', 'white'],  // face 0 (Left - Green) - right column changed
  ['yellow', 'blue', 'blue', 'yellow', 'blue', 'blue', 'yellow', 'blue', 'blue'],  // face 1 (Right - Blue) - left column changed
  ['white', 'white', 'white', 'white', 'white', 'white', 'blue', 'blue', 'blue'],  // face 2 (Top - White) - bottom row changed
  ['green', 'green', 'green', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],  // face 3 (Bottom - Yellow) - top row changed
  ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],  // face 4 (Front - Red, rotated)
  ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange']  // face 5 (Back - Orange) - unchanged
];

const RubiksCube = () => {
  const [cubeState, setCubeState] = useState([
    Array(9).fill('green'),   // 0: Green - Left face
    Array(9).fill('blue'),    // 1: Blue - Right face
    Array(9).fill('white'),   // 2: White - Top face
    Array(9).fill('yellow'),  // 3: Yellow - Bottom face
    Array(9).fill('red'),     // 4: Red - Front face
    Array(9).fill('orange')   // 5: Orange - Back face
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // Standard color mappings with more accurate cube colors
  const colorMap = {
    'blue': '#0055BA',    // Standard blue
    'green': '#009B48',   // Standard green
    'white': '#FFFFFF',   // White
    'yellow': '#FFD500',  // Standard yellow
    'red': '#B90000',     // Standard red
    'orange': '#FF5800'   // Standard orange
  };

  // Face labels with indices matching backend API
  const faceLabels = ['Left', 'Right', 'Top', 'Bottom', 'Front', 'Back'];
  
  // Face opposites for reference
  const faceOpposites = {
    0: 1, // Left <-> Right
    1: 0, // Right <-> Left
    2: 3, // Top <-> Bottom
    3: 2, // Bottom <-> Top
    4: 5, // Front <-> Back
    5: 4  // Back <-> Front
  };

  // Helper function to compare two states (for testing)
  const compareStates = (state1, state2) => {
    if (!state1 || !state2) return false;
    
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (state1[faceIndex][cellIndex] !== state2[faceIndex][cellIndex]) {
          console.log(`Mismatch at face ${faceIndex}, cell ${cellIndex}: ${state1[faceIndex][cellIndex]} vs ${state2[faceIndex][cellIndex]}`);
          return false;
        }
      }
    }
    console.log("States match perfectly!");
    return true;
  };

  // Test function to check if F or F' rotation produces expected state
  const testRotation = async (move) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Reset cube first to ensure clean state
      await axios.post(`${API_BASE_URL}/api/cube/reset`, {}, {
        withCredentials: true
      });
      
      // Then make the specified move
      const response = await axios.post(`${API_BASE_URL}/api/cube/move`, { move }, {
        withCredentials: true
      });
      
      if (response.data.cubeState) {
        const receivedState = response.data.cubeState;
        setCubeState(receivedState);
        
        // Compare with expected state based on the move
        const expectedState = move === 'F' ? EXPECTED_STATE_AFTER_F : EXPECTED_STATE_AFTER_F_PRIME;
        const isCorrect = compareStates(receivedState, expectedState);
        
        // Log details for debugging
        console.log(`Expected state after ${move}:`, expectedState);
        console.log("Received state:", receivedState);
        console.log("States match:", isCorrect);
        
        setTestResult({
          success: isCorrect,
          message: isCorrect ? 
            `${move} rotation produces the correct state!` : 
            `${move} rotation does not produce the expected state. Check console for details.`
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error(`Error testing ${move} rotation:`, error);
      setError(`Failed to test ${move} rotation. Check if the backend server is running.`);
      setIsLoading(false);
    }
  };

  // Fetch initial cube state
  useEffect(() => {
    const fetchCubeState = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/cube/state`, {
          withCredentials: true
        });
        if (response.data.cubeState) {
          setCubeState(response.data.cubeState);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cube state:', error);
        setError('Failed to fetch cube state from server');
        setIsLoading(false);
      }
    };

    fetchCubeState();
  }, []);

  // Handle cube move
  const handleMove = async (move) => {
    try {
      setIsLoading(true);
      setError(null);
      setLastMove(move);
      setTestResult(null);
      
      // Send the current cube state along with the move request
      const response = await axios.post(`${API_BASE_URL}/api/cube/move`, { 
        move,
        currentState: cubeState  // Send the current state to the backend
      }, {
        withCredentials: true
      });
      
      if (response.data.cubeState) {
        setCubeState(response.data.cubeState);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error making move:', error);
      setError('Failed to make move. Check if the backend server is running.');
      setIsLoading(false);
    }
  };

  // Reset cube to solved state
  const handleReset = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLastMove(null);
      setTestResult(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/cube/reset`, {}, {
        withCredentials: true
      });
      
      if (response.data.cubeState) {
        setCubeState(response.data.cubeState);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error resetting cube:', error);
      setError('Failed to reset cube. Check if the backend server is running.');
      setIsLoading(false);
    }
  };

  // Render a single cell with its color
  const renderCell = (faceIndex, row, col) => {
    const face = cubeState[faceIndex];
    const index = row * 3 + col;
    const color = face[index];
    
    // Special highlighting for cells affected by the last move
    const isAffectedByLastMove = lastMove && isCellAffectedByMove(faceIndex, index, lastMove);
    
    return (
      <div 
        key={`cell-${row}-${col}`} 
        className={`face-cell ${isAffectedByLastMove ? 'last-moved' : ''}`}
        style={{ backgroundColor: colorMap[color] || '#ccc' }}
        title={`Face: ${faceLabels[faceIndex]}, Position: ${index}`}
      />
    );
  };

  // Check if a cell was affected by the last move
  const isCellAffectedByMove = (faceIndex, cellIndex, move) => {
    if (!move) return false;
    
    const faceToRotate = move.charAt(0);
    const isPrime = move.includes("'");
    let rotatingFaceIndex;
    
    // Map the rotation letter to the face index
    switch(faceToRotate) {
      case 'F': rotatingFaceIndex = 4; break; // Front
      case 'B': rotatingFaceIndex = 5; break; // Back
      case 'U': rotatingFaceIndex = 2; break; // Top/Up
      case 'D': rotatingFaceIndex = 3; break; // Bottom/Down
      case 'L': rotatingFaceIndex = 0; break; // Left
      case 'R': rotatingFaceIndex = 1; break; // Right
      default: return false;
    }
    
    // If this is the rotating face itself, all cells are affected
    if (faceIndex === rotatingFaceIndex) return true;
    
    // If this is the opposite face, no cells are affected
    if (faceIndex === faceOpposites[rotatingFaceIndex]) return false;
    
    // Define the affected cells based on the specific rotation
    switch(rotatingFaceIndex) {
      case 4: // Front face rotation (Red)
        // Top face (White), bottom row
        if (faceIndex === 2 && [6, 7, 8].includes(cellIndex)) return true;
        // Right face (Green), left column
        if (faceIndex === 1 && [0, 3, 6].includes(cellIndex)) return true;
        // Bottom face (Yellow), top row
        if (faceIndex === 3 && [0, 1, 2].includes(cellIndex)) return true;
        // Left face (Blue), right column
        if (faceIndex === 0 && [2, 5, 8].includes(cellIndex)) return true;
        break;
      
      case 5: // Back face rotation (Orange)
        // Top face (White), top row
        if (faceIndex === 2 && [0, 1, 2].includes(cellIndex)) return true;
        // Left face (Blue), left column
        if (faceIndex === 0 && [0, 3, 6].includes(cellIndex)) return true;
        // Bottom face (Yellow), bottom row
        if (faceIndex === 3 && [6, 7, 8].includes(cellIndex)) return true;
        // Right face (Green), right column
        if (faceIndex === 1 && [2, 5, 8].includes(cellIndex)) return true;
        break;
      
      case 2: // Top face rotation (White)
        // Back face (Orange), top row
        if (faceIndex === 5 && [0, 1, 2].includes(cellIndex)) return true;
        // Right face (Green), top row
        if (faceIndex === 1 && [0, 1, 2].includes(cellIndex)) return true;
        // Front face (Red), top row
        if (faceIndex === 4 && [0, 1, 2].includes(cellIndex)) return true;
        // Left face (Blue), top row
        if (faceIndex === 0 && [0, 1, 2].includes(cellIndex)) return true;
        break;
      
      case 3: // Bottom face rotation (Yellow)
        // Front face (Red), bottom row
        if (faceIndex === 4 && [6, 7, 8].includes(cellIndex)) return true;
        // Right face (Green), bottom row
        if (faceIndex === 1 && [6, 7, 8].includes(cellIndex)) return true;
        // Back face (Orange), bottom row
        if (faceIndex === 5 && [6, 7, 8].includes(cellIndex)) return true;
        // Left face (Blue), bottom row
        if (faceIndex === 0 && [6, 7, 8].includes(cellIndex)) return true;
        break;
      
      case 1: // Right face rotation (Green)
        // Top face (White), right column
        if (faceIndex === 2 && [2, 5, 8].includes(cellIndex)) return true;
        // Back face (Orange), left column (reversed)
        if (faceIndex === 5 && [0, 3, 6].includes(cellIndex)) return true;
        // Bottom face (Yellow), right column
        if (faceIndex === 3 && [2, 5, 8].includes(cellIndex)) return true;
        // Front face (Red), right column
        if (faceIndex === 4 && [2, 5, 8].includes(cellIndex)) return true;
        break;
      
      case 0: // Left face rotation (Blue)
        // Top face (White), left column
        if (faceIndex === 2 && [0, 3, 6].includes(cellIndex)) return true;
        // Front face (Red), left column
        if (faceIndex === 4 && [0, 3, 6].includes(cellIndex)) return true;
        // Bottom face (Yellow), left column
        if (faceIndex === 3 && [0, 3, 6].includes(cellIndex)) return true;
        // Back face (Orange), right column (reversed)
        if (faceIndex === 5 && [2, 5, 8].includes(cellIndex)) return true;
        break;
    }
    
    return false;
  };

  // Render a single face of the cube
  const renderFace = (faceIndex) => {
    const label = faceLabels[faceIndex];
    
    return (
      <div className="face-container">
        <h3 className="face-label">{label}</h3>
        <div className="face">
          {Array.from({ length: 3 }, (_, row) => (
            <div key={`row-${row}`} className="face-row">
              {Array.from({ length: 3 }, (_, col) => renderCell(faceIndex, row, col))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get detailed description of a move
  const getMoveDescription = (move) => {
    const basicMove = move.charAt(0);
    const isPrime = move.includes("'");
    
    const direction = isPrime ? "counterclockwise" : "clockwise";
    
    switch(basicMove) {
      case 'F': 
        return `Front face ${direction} - affects Top, Right, Bottom, and Left edges`;
      case 'B': 
        return `Back face ${direction} - affects Top, Left, Bottom, and Right edges`;
      case 'U': 
        return `Top face ${direction} - affects Back, Right, Front, and Left top rows`;
      case 'D': 
        return `Bottom face ${direction} - affects Front, Right, Back, and Left bottom rows`;
      case 'L': 
        return `Left face ${direction} - affects Top, Front, Bottom, and Back edges`;
      case 'R': 
        return `Right face ${direction} - affects Top, Back, Bottom, and Front edges`;
      default: 
        return "";
    }
  };

  // Define move buttons with additional descriptive hover text
  const moveButtons = [
    { move: 'F', label: 'F', description: getMoveDescription('F') },
    { move: 'F\'', label: 'F\'', description: getMoveDescription('F\'') },
    { move: 'B', label: 'B', description: getMoveDescription('B') },
    { move: 'B\'', label: 'B\'', description: getMoveDescription('B\'') },
    { move: 'U', label: 'U', description: getMoveDescription('U') },
    { move: 'U\'', label: 'U\'', description: getMoveDescription('U\'') },
    { move: 'D', label: 'D', description: getMoveDescription('D') },
    { move: 'D\'', label: 'D\'', description: getMoveDescription('D\'') },
    { move: 'L', label: 'L', description: getMoveDescription('L') },
    { move: 'L\'', label: 'L\'', description: getMoveDescription('L\'') },
    { move: 'R', label: 'R', description: getMoveDescription('R') },
    { move: 'R\'', label: 'R\'', description: getMoveDescription('R\'') }
  ];

  return (
    <div className="rubiks-cube-container">
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="cube-visualization">
        <div className="cube-net">
          {/* Top face - index 2 (White) */}
          <div className="net-up">{renderFace(2)}</div>
          
          {/* Middle row: Left, Front, Right, Back faces */}
          <div className="net-middle">
            <div className="net-left">{renderFace(0)}</div>
            <div className="net-front">{renderFace(4)}</div>
            <div className="net-right">{renderFace(1)}</div>
            <div className="net-back">{renderFace(5)}</div>
          </div>
          
          {/* Bottom face - index 3 (Yellow) */}
          <div className="net-down">{renderFace(3)}</div>
        </div>
      </div>
      
      {testResult && (
        <div className={`test-result text-sm text-center mb-2 p-2 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <strong>Test Result:</strong> {testResult.message}
        </div>
      )}
      
      {lastMove && (
        <div className="last-move text-xs text-center mb-2">
          Last move: <strong>{lastMove}</strong>
          <span className="ml-1 text-gray-500">- Glowing cells show affected pieces</span>
        </div>
      )}
      
      <div className="controls">
        <div className="buttons-grid">
          {moveButtons.map((button) => (
            <button
              key={button.move}
              onClick={() => handleMove(button.move)}
              disabled={isLoading}
              className={`
                px-2 py-1 rounded-md text-sm font-medium
                bg-blue-500 text-white
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
                ${lastMove === button.move ? 'ring-2 ring-blue-300' : ''}
              `}
              title={button.description}
            >
              {button.label}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center mt-3 space-x-2">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className={`
              px-4 py-1 rounded-md text-sm font-medium
              bg-green-500 text-white
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}
            `}
          >
            Reset Cube
          </button>
          
          <button
            onClick={() => testRotation('F')}
            disabled={isLoading}
            className={`
              px-4 py-1 rounded-md text-sm font-medium
              bg-purple-500 text-white
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'}
            `}
            title="Tests if an F rotation produces the expected state"
          >
            Test F Rotation
          </button>
          
          <button
            onClick={() => testRotation("F'")}
            disabled={isLoading}
            className={`
              px-4 py-1 rounded-md text-sm font-medium
              bg-indigo-500 text-white
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}
            `}
            title="Tests if an F' rotation produces the expected state"
          >
            Test F' Rotation
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="loading-indicator mt-2 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
};

export default RubiksCube; 