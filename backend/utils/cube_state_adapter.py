from models.cube import RubiksCube
import copy

def convert_3d_to_2d_state(cube_3d_state):
    """Convert the 3D cube state to the 2D array format expected by the frontend.
    
    Args:
        cube_3d_state: A list of six 3x3 arrays representing the cube state in the order:
                    [left, right, up, down, front, back]
                    
    Returns:
        A list of six lists, each containing 9 color strings in the format expected by the frontend.
    """
    # The frontend expects an array of 6 faces, each with 9 colors in row-major order
    converted_state = []
    
    # Process each face
    for face_grid in cube_3d_state:
        # Convert 3x3 grid to a 1D array in row-major order
        face_colors = []
        for row in face_grid:
            face_colors.extend(row)
        converted_state.append(face_colors)
    
    return converted_state

def convert_2d_to_3d_state(cube_2d_state):
    """Convert the 2D array format used by the frontend to a 3D cube state.
    
    Args:
        cube_2d_state: A list of six lists, each containing 9 color strings.
                    
    Returns:
        A list of six 3x3 arrays representing the cube state.
    """
    converted_state = []
    
    # Process each face
    for face_colors in cube_2d_state:
        # Convert 1D array to 3x3 grid
        face_grid = []
        for i in range(0, 9, 3):
            face_grid.append(face_colors[i:i+3])
        converted_state.append(face_grid)
    
    return converted_state

def create_cube_from_2d_state(cube_2d_state):
    """Create a RubiksCube object from a 2D state array.
    
    Args:
        cube_2d_state: A list of six lists, each containing 9 color strings.
                    
    Returns:
        A RubiksCube object with the specified state.
    """
    # If we don't have a state yet, return a solved cube
    if not cube_2d_state or len(cube_2d_state) != 6:
        return RubiksCube()
    
    # Create a new cube
    cube = RubiksCube()
    
    # Convert the 2D state to 3D format
    state_3d = convert_2d_to_3d_state(cube_2d_state)
    
    # Store the current state directly in the cube instance
    cube.current_state_3d = copy.deepcopy(state_3d)
    
    # Replace the get_state method to return our stored state
    original_get_state = cube.get_state
    
    def new_get_state():
        return cube.current_state_3d
    
    cube.get_state = new_get_state
    
    return cube

def is_solved_state(cube_2d_state):
    """Check if the given 2D state represents a solved cube.
    
    In a solved cube, each face has all 9 stickers of the same color.
    
    Args:
        cube_2d_state: A list of six lists, each containing 9 color strings.
                    
    Returns:
        True if the cube is solved, False otherwise.
    """
    for face in cube_2d_state:
        color = face[0]
        if not all(sticker == color for sticker in face):
            return False
    return True

def is_default_state(cube_2d_state):
    """Check if the given 2D state represents the default initial state.
    
    Args:
        cube_2d_state: A list of six lists, each containing 9 color strings.
                    
    Returns:
        True if the state matches the default state, False otherwise.
    """
    default_colors = ['green', 'blue', 'white', 'yellow', 'red', 'orange']
    
    for i, face in enumerate(cube_2d_state):
        expected_color = default_colors[i]
        if not all(sticker == expected_color for sticker in face):
            return False
    return True 