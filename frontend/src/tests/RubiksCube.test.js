import * as THREE from 'three';
import { getFaceIndex } from '../utils/cubeUtils';

// Mock cube state for a solved cube
const SOLVED_CUBE = [
  ['blue'] * 9,    // Right (0)
  ['green'] * 9,   // Left (1)
  ['white'] * 9,   // Up (2)
  ['yellow'] * 9,  // Down (3)
  ['red'] * 9,     // Front (4)
  ['orange'] * 9   // Back (5)
];

// Tests for the face index calculation
describe('Cube face index calculations', () => {
  test('getFaceIndex returns correct indices for right face', () => {
    // The right face is at x=1, so we're testing all 9 pieces on that face
    // Coordinates are in -1 to 1 range for x, y, z
    const expected = [
      // First row (top)
      getFaceIndex(1, 1, -1, 'right'),  // Top-back
      getFaceIndex(1, 1, 0, 'right'),   // Top-middle
      getFaceIndex(1, 1, 1, 'right'),   // Top-front

      // Middle row 
      getFaceIndex(1, 0, -1, 'right'),  // Middle-back
      getFaceIndex(1, 0, 0, 'right'),   // Center
      getFaceIndex(1, 0, 1, 'right'),   // Middle-front

      // Bottom row
      getFaceIndex(1, -1, -1, 'right'), // Bottom-back
      getFaceIndex(1, -1, 0, 'right'),  // Bottom-middle
      getFaceIndex(1, -1, 1, 'right'),  // Bottom-front
    ];
    
    // The right face should have pieces 0-8 in a consistent order
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('getFaceIndex returns correct indices for left face', () => {
    const expected = [
      getFaceIndex(-1, 1, -1, 'left'),  // Top-back
      getFaceIndex(-1, 1, 0, 'left'),   // Top-middle
      getFaceIndex(-1, 1, 1, 'left'),   // Top-front
      
      getFaceIndex(-1, 0, -1, 'left'),  // Middle-back
      getFaceIndex(-1, 0, 0, 'left'),   // Center
      getFaceIndex(-1, 0, 1, 'left'),   // Middle-front
      
      getFaceIndex(-1, -1, -1, 'left'), // Bottom-back
      getFaceIndex(-1, -1, 0, 'left'),  // Bottom-middle
      getFaceIndex(-1, -1, 1, 'left'),  // Bottom-front
    ];
    
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('getFaceIndex returns correct indices for up face', () => {
    const expected = [
      getFaceIndex(-1, 1, -1, 'up'),  // Left-back
      getFaceIndex(0, 1, -1, 'up'),   // Center-back
      getFaceIndex(1, 1, -1, 'up'),   // Right-back
      
      getFaceIndex(-1, 1, 0, 'up'),   // Left-middle
      getFaceIndex(0, 1, 0, 'up'),    // Center
      getFaceIndex(1, 1, 0, 'up'),    // Right-middle
      
      getFaceIndex(-1, 1, 1, 'up'),   // Left-front
      getFaceIndex(0, 1, 1, 'up'),    // Center-front
      getFaceIndex(1, 1, 1, 'up'),    // Right-front
    ];
    
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('getFaceIndex returns correct indices for down face', () => {
    const expected = [
      getFaceIndex(-1, -1, -1, 'down'),  // Left-back
      getFaceIndex(0, -1, -1, 'down'),   // Center-back
      getFaceIndex(1, -1, -1, 'down'),   // Right-back
      
      getFaceIndex(-1, -1, 0, 'down'),   // Left-middle
      getFaceIndex(0, -1, 0, 'down'),    // Center
      getFaceIndex(1, -1, 0, 'down'),    // Right-middle
      
      getFaceIndex(-1, -1, 1, 'down'),   // Left-front
      getFaceIndex(0, -1, 1, 'down'),    // Center-front
      getFaceIndex(1, -1, 1, 'down'),    // Right-front
    ];
    
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('getFaceIndex returns correct indices for front face', () => {
    const expected = [
      getFaceIndex(-1, 1, 1, 'front'),   // Top-left
      getFaceIndex(0, 1, 1, 'front'),    // Top-center
      getFaceIndex(1, 1, 1, 'front'),    // Top-right
      
      getFaceIndex(-1, 0, 1, 'front'),   // Middle-left
      getFaceIndex(0, 0, 1, 'front'),    // Center
      getFaceIndex(1, 0, 1, 'front'),    // Middle-right
      
      getFaceIndex(-1, -1, 1, 'front'),  // Bottom-left
      getFaceIndex(0, -1, 1, 'front'),   // Bottom-center
      getFaceIndex(1, -1, 1, 'front'),   // Bottom-right
    ];
    
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('getFaceIndex returns correct indices for back face', () => {
    const expected = [
      getFaceIndex(1, 1, -1, 'back'),    // Top-right (from back perspective)
      getFaceIndex(0, 1, -1, 'back'),    // Top-center
      getFaceIndex(-1, 1, -1, 'back'),   // Top-left
      
      getFaceIndex(1, 0, -1, 'back'),    // Middle-right
      getFaceIndex(0, 0, -1, 'back'),    // Center
      getFaceIndex(-1, 0, -1, 'back'),   // Middle-left
      
      getFaceIndex(1, -1, -1, 'back'),   // Bottom-right
      getFaceIndex(0, -1, -1, 'back'),   // Bottom-center
      getFaceIndex(-1, -1, -1, 'back'),  // Bottom-left
    ];
    
    expect(expected).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
}); 