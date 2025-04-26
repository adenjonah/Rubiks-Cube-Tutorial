import sys
import os
import unittest
from flask import Flask, session
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import handle_cube_move, rotate_face_clockwise, rotate_face_counterclockwise

class TestCubeRotations(unittest.TestCase):
    def setUp(self):
        # Initialize a solved cube
        self.solved_cube = [
            ['blue'] * 9,    # Right (0)
            ['green'] * 9,   # Left (1)
            ['white'] * 9,   # Up (2)
            ['yellow'] * 9,  # Down (3)
            ['red'] * 9,     # Front (4)
            ['orange'] * 9   # Back (5)
        ]
    
    def test_face_rotation_clockwise(self):
        """Test that a face rotates correctly clockwise"""
        face = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
        rotated = rotate_face_clockwise(face)
        self.assertEqual(rotated, ['g', 'd', 'a', 'h', 'e', 'b', 'i', 'f', 'c'])
    
    def test_face_rotation_counterclockwise(self):
        """Test that a face rotates correctly counterclockwise"""
        face = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
        rotated = rotate_face_counterclockwise(face)
        self.assertEqual(rotated, ['c', 'f', 'i', 'b', 'e', 'h', 'a', 'd', 'g'])
    
    def test_up_face_clockwise(self):
        """Test that a U move correctly rotates the up face and adjacent edges"""
        cube = self.solved_cube.copy()
        expected_up_face = ['white'] * 9  # Up face doesn't change color
        expected_front_top = ['blue'] * 3  # Top of front face comes from right
        expected_right_top = ['orange'] * 3  # Top of right face comes from back
        expected_back_top = ['green'] * 3  # Top of back face comes from left
        expected_left_top = ['red'] * 3  # Top of left face comes from front
        
        result = handle_cube_move('U', cube)
        
        # Check if the U face is rotated correctly
        self.assertEqual(result[2], expected_up_face)
        
        # Check if the adjacent edges are rotated correctly
        self.assertEqual(result[4][0:3], expected_front_top)
        self.assertEqual(result[0][0:3], expected_right_top)
        self.assertEqual(result[5][0:3], expected_back_top)
        self.assertEqual(result[1][0:3], expected_left_top)
    
    def test_right_face_clockwise(self):
        """Test that an R move correctly rotates the right face and adjacent edges"""
        cube = self.solved_cube.copy()
        expected_right_face = ['blue'] * 9  # Right face doesn't change color
        
        # The tricky part is that pieces along the right edge of other faces move
        # Up face: pieces 2,5,8 go to back face
        # Back face: pieces 0,3,6 go to down face
        # Down face: pieces 2,5,8 go to front face
        # Front face: pieces 2,5,8 go to up face
        
        result = handle_cube_move('R', cube)
        
        # Check if the R face is rotated correctly
        self.assertEqual(result[0], expected_right_face)
        
        # Check adjacent edges
        self.assertEqual(result[2][2], 'orange')  # Up face right edge
        self.assertEqual(result[2][5], 'orange')
        self.assertEqual(result[2][8], 'orange')
        
        self.assertEqual(result[5][0], 'yellow')  # Back face left edge
        self.assertEqual(result[5][3], 'yellow')
        self.assertEqual(result[5][6], 'yellow')
        
        self.assertEqual(result[3][2], 'red')  # Down face right edge
        self.assertEqual(result[3][5], 'red')
        self.assertEqual(result[3][8], 'red')
        
        self.assertEqual(result[4][2], 'white')  # Front face right edge
        self.assertEqual(result[4][5], 'white')
        self.assertEqual(result[4][8], 'white')
    
    def test_front_face_clockwise(self):
        """Test that an F move correctly rotates the front face and adjacent edges"""
        cube = self.solved_cube.copy()
        expected_front_face = ['red'] * 9  # Front face doesn't change color
        
        result = handle_cube_move('F', cube)
        
        # Check if the F face is rotated correctly
        self.assertEqual(result[4], expected_front_face)
        
        # Check adjacent edges
        # Top edge of front comes from left face
        self.assertEqual(result[2][6], 'green')
        self.assertEqual(result[2][7], 'green')
        self.assertEqual(result[2][8], 'green')
        
        # Right edge of front comes from up face
        self.assertEqual(result[0][6], 'white')
        self.assertEqual(result[0][7], 'white')
        self.assertEqual(result[0][8], 'white')
        
        # Bottom edge of front comes from right face
        self.assertEqual(result[3][0], 'blue')
        self.assertEqual(result[3][1], 'blue')
        self.assertEqual(result[3][2], 'blue')
        
        # Left edge of front comes from down face
        self.assertEqual(result[1][2], 'yellow')
        self.assertEqual(result[1][5], 'yellow')
        self.assertEqual(result[1][8], 'yellow')
    
    def test_full_rotation_sequence(self):
        """Test a sequence of moves to verify overall consistency"""
        cube = self.solved_cube.copy()
        
        # Apply a standard algorithm (R U R' U')
        cube = handle_cube_move('R', cube)
        cube = handle_cube_move('U', cube)
        cube = handle_cube_move('R\'', cube)
        cube = handle_cube_move('U\'', cube)
        
        # Apply the inverse to get back to solved state
        cube = handle_cube_move('U', cube)
        cube = handle_cube_move('R', cube)
        cube = handle_cube_move('U\'', cube)
        cube = handle_cube_move('R\'', cube)
        
        # The cube should be solved again
        self.assertEqual(cube, self.solved_cube)
    
    def test_prime_move_equals_three_normal_moves(self):
        """Test that a prime (counterclockwise) move equals three clockwise moves"""
        cube1 = self.solved_cube.copy()
        cube2 = self.solved_cube.copy()
        
        # Apply R' to first cube
        cube1 = handle_cube_move('R\'', cube1)
        
        # Apply R three times to second cube
        cube2 = handle_cube_move('R', cube2)
        cube2 = handle_cube_move('R', cube2)
        cube2 = handle_cube_move('R', cube2)
        
        # Both cubes should be in the same state
        self.assertEqual(cube1, cube2)

if __name__ == '__main__':
    unittest.main() 