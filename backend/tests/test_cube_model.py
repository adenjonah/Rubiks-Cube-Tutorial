import unittest
import sys
import os

# Ensure we can import from the parent directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.cube import RubiksCube
from utils.cube_state_adapter import convert_3d_to_2d_state, convert_2d_to_3d_state

class TestCubeModel(unittest.TestCase):
    """Test the 3D Rubik's Cube model."""
    
    def test_initial_state(self):
        """Test that a new cube is in the solved state."""
        cube = RubiksCube()
        state = cube.get_state()
        
        # Check that each face has a single color
        faces = ['right', 'left', 'up', 'down', 'front', 'back']
        expected_colors = ['blue', 'green', 'white', 'yellow', 'red', 'orange']
        
        for i, face in enumerate(state):
            color = expected_colors[i]
            for row in face:
                for cell in row:
                    self.assertEqual(cell, color)
    
    def test_face_rotation(self):
        """Test that rotating a face works correctly."""
        cube = RubiksCube()
        
        # Get the initial state
        initial_state = [row[:] for face in cube.get_state() for row in face]
        
        # Rotate the front face clockwise
        cube.rotate_face('front', True)
        
        # Check that the front face is still all red (center doesn't change)
        front_face = cube.get_face_colors('front')
        self.assertEqual(front_face[1][1], 'red')  # Center piece stays red
        
        # Get the new state
        new_state = [row[:] for face in cube.get_state() for row in face]
        
        # Verify that the state has changed
        self.assertNotEqual(initial_state, new_state, "Cube state should change after rotation")
    
    def test_move_notation(self):
        """Test that the move notation works correctly."""
        cube = RubiksCube()
        
        # Make a move using the standard notation
        cube.make_move('F')
        
        # Make the inverse move
        cube.make_move("F'")
        
        # The cube should now be back in the solved state
        state = cube.get_state()
        faces = ['right', 'left', 'up', 'down', 'front', 'back']
        expected_colors = ['blue', 'green', 'white', 'yellow', 'red', 'orange']
        
        for i, face in enumerate(state):
            color = expected_colors[i]
            for row_idx, row in enumerate(face):
                for col_idx, cell in enumerate(row):
                    if cell is None:
                        self.fail(f"Found None value in face {faces[i]} at position [{row_idx}][{col_idx}]")
                    self.assertEqual(cell, color)
    
    def test_state_conversion(self):
        """Test conversion between 3D and 2D state representations."""
        cube = RubiksCube()
        state_3d = cube.get_state()
        
        # Convert to 2D
        state_2d = convert_3d_to_2d_state(state_3d)
        
        # Check that the 2D state has 6 faces with 9 colors each
        self.assertEqual(len(state_2d), 6)
        for face in state_2d:
            self.assertEqual(len(face), 9)
        
        # Convert back to 3D
        state_3d_converted = convert_2d_to_3d_state(state_2d)
        
        # Check that the conversion preserves the state
        self.assertEqual(len(state_3d), len(state_3d_converted))
        for i in range(len(state_3d)):
            self.assertEqual(len(state_3d[i]), len(state_3d_converted[i]))
            for j in range(len(state_3d[i])):
                self.assertEqual(state_3d[i][j], state_3d_converted[i][j])

if __name__ == '__main__':
    unittest.main() 