/**
 * Maps a cube position (x,y,z) to the corresponding index in the face array
 * @param {number} x - X coordinate (-1, 0, or 1)
 * @param {number} y - Y coordinate (-1, 0, or 1)
 * @param {number} z - Z coordinate (-1, 0, or 1)
 * @param {string} face - Which face to get index for ('right', 'left', 'up', 'down', 'front', 'back')
 * @returns {number} - Index in the face array (0-8)
 */
export const getFaceIndex = (x, y, z, face) => {
  switch (face) {
    case 'right': // x = 1
      return (1 - y) * 3 + (1 - z);
    case 'left': // x = -1
      return (1 - y) * 3 + (1 + z);
    case 'up': // y = 1
      // Up face is viewed from above, with front at the bottom
      // So the indices should be:
      // 0 1 2  (back row)
      // 3 4 5  (middle row)
      // 6 7 8  (front row - adjacent to front face)
      // We're inverting the indices (180 degree rotation) so:
      // 6 7 8 becomes 2 1 0
      // 3 4 5 becomes 5 4 3
      // 0 1 2 becomes 8 7 6
      return 8 - ((1 - z) * 3 + (1 + x));
    case 'down': // y = -1
      // Down face is viewed from below, with front at the top
      // So the indices should be:
      // 0 1 2  (front row - adjacent to front face)
      // 3 4 5  (middle row)
      // 6 7 8  (back row)
      // We're inverting the indices (180 degree rotation) so:
      // 0 1 2 becomes 8 7 6
      // 3 4 5 becomes 5 4 3
      // 6 7 8 becomes 2 1 0
      return 8 - ((1 + z) * 3 + (1 + x));
    case 'front': // z = 1
      return (1 - y) * 3 + (1 + x);
    case 'back': // z = -1
      return (1 - y) * 3 + (1 - x);
    default:
      return -1;
  }
};

/**
 * Gets the color for a face based on the cube state
 * @param {Array} cubeState - The cube state from the backend
 * @param {number} faceIndex - Index of the face (0-5)
 * @param {number} pieceIndex - Index of the piece on the face (0-8) 
 * @returns {string} - Color name
 */
export const getColorFromState = (cubeState, faceIndex, pieceIndex) => {
  if (!cubeState || !cubeState[faceIndex] || pieceIndex < 0 || pieceIndex > 8) {
    return 'gray';
  }
  return cubeState[faceIndex][pieceIndex];
};

// Standard Rubik's cube color scheme
export const COLORS = {
  white: 0xffffff,  // Up
  yellow: 0xffff00, // Down
  red: 0xff0000,    // Front
  orange: 0xffa500, // Back
  blue: 0x0000ff,   // Right
  green: 0x00ff00,  // Left
  gray: 0x111111    // Hidden faces
};

// Face indices mapping - these MUST match backend ordering
// Based on the backend's FACE_INDICES in models/cube.py
export const FACE_INDICES = {
  LEFT: 0,   // Green (X-)
  RIGHT: 1,  // Blue (X+)
  UP: 2,     // White (Y+)
  DOWN: 3,   // Yellow (Y-)
  FRONT: 4,  // Red (Z+)
  BACK: 5    // Orange (Z-)
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