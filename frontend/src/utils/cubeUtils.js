/**
 * Helper function to get the correct face index based on cube position
 * @param {number} x - X coordinate (-1, 0, 1)
 * @param {number} y - Y coordinate (-1, 0, 1)
 * @param {number} z - Z coordinate (-1, 0, 1)
 * @param {string} face - Face identifier ('right', 'left', 'up', 'down', 'front', 'back')
 * @returns {number} The index of the face piece (0-8)
 */
export const getFaceIndex = (x, y, z, face) => {
  // Convert from -1,0,1 coordinates to 0,1,2 indices
  const i = x + 1;
  const j = y + 1;
  const k = z + 1;
  
  // Calculate the index based on which face we're looking at
  // This follows the standard Rubik's cube notation and face indexing
  
  if (face === 'right') {  // x = 1 face
    // Right face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is top-back, 2 is top-front, 6 is bottom-back, 8 is bottom-front
    return (j * 3) + k;
  }
  
  if (face === 'left') {   // x = -1 face
    // Left face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is top-back, 2 is top-front, 6 is bottom-back, 8 is bottom-front
    // Note: Z is reversed compared to right face because it's the opposite side
    return (j * 3) + (2 - k);
  }
  
  if (face === 'up') {     // y = 1 face
    // Up face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is back-left, 2 is back-right, 6 is front-left, 8 is front-right
    return (k * 3) + i;
  }
  
  if (face === 'down') {   // y = -1 face
    // Down face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is back-left, 2 is back-right, 6 is front-left, 8 is front-right
    // Note: Z is reversed compared to up face because it's viewed from bottom
    return ((2 - k) * 3) + i;
  }
  
  if (face === 'front') {  // z = 1 face
    // Front face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is top-left, 2 is top-right, 6 is bottom-left, 8 is bottom-right
    return ((2 - j) * 3) + i;
  }
  
  if (face === 'back') {   // z = -1 face
    // Back face indices are arranged:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    // Where 0 is top-right, 2 is top-left, 6 is bottom-right, 8 is bottom-left
    // Note: X is reversed compared to front face because it's viewed from back
    return ((2 - j) * 3) + (2 - i);
  }
  
  return 0; // Default case
};

/**
 * Translates the cube state to colors for Three.js rendering
 * @param {Array} cubeState - The cube state from the backend
 * @returns {Object} Object with face indices and color information
 */
export const translateCubeState = (cubeState) => {
  // The COLORS and FACE_INDICES should match those in RubiksCube.js
  const COLORS = {
    white: 0xffffff,  // Up
    yellow: 0xffff00, // Down
    red: 0xff0000,    // Front
    orange: 0xffa500, // Back
    blue: 0x0000ff,   // Right
    green: 0x00ff00   // Left
  };
  
  const FACE_INDICES = {
    RIGHT: 0,  // Blue
    LEFT: 1,   // Green
    UP: 2,     // White
    DOWN: 3,   // Yellow
    FRONT: 4,  // Red
    BACK: 5    // Orange
  };
  
  return { COLORS, FACE_INDICES };
}; 