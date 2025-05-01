from models.cubie import Cubie, CenterCubie, EdgeCubie, CornerCubie
import copy

class RubiksCube:
    """Represents a Rubik's cube as a 3D array of cubies."""
    
    # Standard color scheme - updating to match the expected frontend mapping
    COLORS = {
        'up': 'white',
        'down': 'yellow',
        'left': 'green',  # Green on left face
        'right': 'blue',  # Blue on right face
        'front': 'red',
        'back': 'orange'
    }
    
    # Mapping between face names and their positions
    FACE_POSITIONS = {
        'up': (0, 1, 0),
        'down': (0, -1, 0),
        'left': (-1, 0, 0),
        'right': (1, 0, 0),
        'front': (0, 0, 1),
        'back': (0, 0, -1)
    }
    
    # Face normals (direction vectors)
    FACE_NORMALS = {
        'up': (0, 1, 0),
        'down': (0, -1, 0),
        'left': (-1, 0, 0),
        'right': (1, 0, 0),
        'front': (0, 0, 1),
        'back': (0, 0, -1)
    }
    
    # Adjacent faces for each face in clockwise order
    ADJACENT_FACES = {
        'up': ['back', 'right', 'front', 'left'],
        'down': ['front', 'right', 'back', 'left'],
        'left': ['up', 'front', 'down', 'back'],
        'right': ['up', 'back', 'down', 'front'],
        'front': ['up', 'right', 'down', 'left'],
        'back': ['up', 'left', 'down', 'right']
    }
    
    # Face indices for 2D representation (matching frontend)
    FACE_INDICES = {
        'left': 0,
        'right': 1,
        'up': 2,
        'down': 3,
        'front': 4,
        'back': 5
    }
    
    # Definition of edge stickers affected when rotating each face
    # Format: [face, [indices of affected stickers on that face]]
    EDGE_STICKERS = {
        'front': [
            ['up', [6, 7, 8]],     # Bottom row of up face
            ['right', [0, 3, 6]],  # Left column of right face
            ['down', [2, 1, 0]],   # Top row of down face (reversed)
            ['left', [8, 5, 2]]    # Right column of left face
        ],
        'back': [
            ['up', [2, 1, 0]],     # Top row of up face (reversed)
            ['left', [0, 3, 6]],   # Left column of left face
            ['down', [6, 7, 8]],   # Bottom row of down face (reversed)
            ['right', [8, 5, 2]]   # Right column of right face
        ],
        'up': [
            ['back', [0, 1, 2]],   # Top row of back face
            ['right', [0, 1, 2]],  # Top row of right face
            ['front', [0, 1, 2]],  # Top row of front face
            ['left', [0, 1, 2]]    # Top row of left face
        ],
        'down': [
            ['front', [6, 7, 8]],  # Bottom row of front face
            ['right', [6, 7, 8]],  # Bottom row of right face
            ['back', [6, 7, 8]],   # Bottom row of back face
            ['left', [6, 7, 8]]    # Bottom row of left face
        ],
        'left': [
            ['up', [0, 3, 6]],     # Left column of up face
            ['front', [0, 3, 6]],  # Left column of front face
            ['down', [0, 3, 6]],   # Left column of down face
            ['back', [8, 5, 2]]    # Right column of back face (reversed)
        ],
        'right': [
            ['up', [8, 5, 2]],     # Right column of up face
            ['back', [0, 3, 6]],   # Left column of back face (reversed)
            ['down', [8, 5, 2]],   # Right column of down face
            ['front', [8, 5, 2]]   # Right column of front face
        ]
    }
    
    def __init__(self):
        """Initialize a solved Rubik's cube."""
        # Create a 3x3x3 array to hold cubies
        self.cubies = {}
        self._initialize_cube()
    
    def _initialize_cube(self):
        """Initialize the cube with all cubies in the solved state."""
        # Create center cubies (6)
        for face, pos in self.FACE_POSITIONS.items():
            self.cubies[pos] = CenterCubie(pos, face, self.COLORS[face])
        
        # Create edge cubies (12)
        # Up-Front edge
        pos = (0, 1, 1)
        self.cubies[pos] = EdgeCubie(pos, 'up', self.COLORS['up'], 'front', self.COLORS['front'])
        
        # Up-Back edge
        pos = (0, 1, -1)
        self.cubies[pos] = EdgeCubie(pos, 'up', self.COLORS['up'], 'back', self.COLORS['back'])
        
        # Up-Left edge
        pos = (-1, 1, 0)
        self.cubies[pos] = EdgeCubie(pos, 'up', self.COLORS['up'], 'left', self.COLORS['left'])
        
        # Up-Right edge
        pos = (1, 1, 0)
        self.cubies[pos] = EdgeCubie(pos, 'up', self.COLORS['up'], 'right', self.COLORS['right'])
        
        # Down-Front edge
        pos = (0, -1, 1)
        self.cubies[pos] = EdgeCubie(pos, 'down', self.COLORS['down'], 'front', self.COLORS['front'])
        
        # Down-Back edge
        pos = (0, -1, -1)
        self.cubies[pos] = EdgeCubie(pos, 'down', self.COLORS['down'], 'back', self.COLORS['back'])
        
        # Down-Left edge
        pos = (-1, -1, 0)
        self.cubies[pos] = EdgeCubie(pos, 'down', self.COLORS['down'], 'left', self.COLORS['left'])
        
        # Down-Right edge
        pos = (1, -1, 0)
        self.cubies[pos] = EdgeCubie(pos, 'down', self.COLORS['down'], 'right', self.COLORS['right'])
        
        # Front-Left edge
        pos = (-1, 0, 1)
        self.cubies[pos] = EdgeCubie(pos, 'front', self.COLORS['front'], 'left', self.COLORS['left'])
        
        # Front-Right edge
        pos = (1, 0, 1)
        self.cubies[pos] = EdgeCubie(pos, 'front', self.COLORS['front'], 'right', self.COLORS['right'])
        
        # Back-Left edge
        pos = (-1, 0, -1)
        self.cubies[pos] = EdgeCubie(pos, 'back', self.COLORS['back'], 'left', self.COLORS['left'])
        
        # Back-Right edge
        pos = (1, 0, -1)
        self.cubies[pos] = EdgeCubie(pos, 'back', self.COLORS['back'], 'right', self.COLORS['right'])
        
        # Create corner cubies (8)
        # Up-Front-Left corner
        pos = (-1, 1, 1)
        self.cubies[pos] = CornerCubie(pos, 'up', self.COLORS['up'], 'front', 
                                       self.COLORS['front'], 'left', self.COLORS['left'])
        
        # Up-Front-Right corner
        pos = (1, 1, 1)
        self.cubies[pos] = CornerCubie(pos, 'up', self.COLORS['up'], 'front', 
                                       self.COLORS['front'], 'right', self.COLORS['right'])
        
        # Up-Back-Left corner
        pos = (-1, 1, -1)
        self.cubies[pos] = CornerCubie(pos, 'up', self.COLORS['up'], 'back', 
                                       self.COLORS['back'], 'left', self.COLORS['left'])
        
        # Up-Back-Right corner
        pos = (1, 1, -1)
        self.cubies[pos] = CornerCubie(pos, 'up', self.COLORS['up'], 'back', 
                                      self.COLORS['back'], 'right', self.COLORS['right'])
        
        # Down-Front-Left corner
        pos = (-1, -1, 1)
        self.cubies[pos] = CornerCubie(pos, 'down', self.COLORS['down'], 'front', 
                                       self.COLORS['front'], 'left', self.COLORS['left'])
        
        # Down-Front-Right corner
        pos = (1, -1, 1)
        self.cubies[pos] = CornerCubie(pos, 'down', self.COLORS['down'], 'front', 
                                       self.COLORS['front'], 'right', self.COLORS['right'])
        
        # Down-Back-Left corner
        pos = (-1, -1, -1)
        self.cubies[pos] = CornerCubie(pos, 'down', self.COLORS['down'], 'back', 
                                       self.COLORS['back'], 'left', self.COLORS['left'])
        
        # Down-Back-Right corner
        pos = (1, -1, -1)
        self.cubies[pos] = CornerCubie(pos, 'down', self.COLORS['down'], 'back', 
                                       self.COLORS['back'], 'right', self.COLORS['right'])
    
    def get_face_colors(self, face):
        """Get the colors of all cubies on a particular face.
        
        Args:
            face: The face to get colors for ('up', 'down', 'left', 'right', 'front', 'back').
            
        Returns:
            A 3x3 grid of colors representing the face.
        """
        # Initialize with default color (shouldn't be needed if cube is valid)
        default_color = self.COLORS[face]
        colors = [[default_color for _ in range(3)] for _ in range(3)]
        normal = self.FACE_NORMALS[face]
        
        # Determine which coordinate is fixed for this face
        fixed_axis = next(i for i, v in enumerate(normal) if v != 0)
        fixed_value = normal[fixed_axis]
        
        # Determine the other two axes
        other_axes = [i for i in range(3) if i != fixed_axis]
        
        # Map from cube coordinates to grid coordinates
        for pos, cubie in self.cubies.items():
            # Check if this cubie is on the face
            if pos[fixed_axis] == fixed_value:
                # Calculate grid coordinates
                if fixed_axis == 0:  # Left/Right faces
                    row = 1 - pos[other_axes[1]]  # Z-axis
                    col = 1 + pos[other_axes[0]]  # Y-axis
                elif fixed_axis == 1:  # Up/Down faces
                    if face == 'up':
                        row = 1 - pos[other_axes[1]]  # Z-axis
                        col = 1 + pos[other_axes[0]]  # X-axis
                    else:  # down face
                        row = 1 + pos[other_axes[1]]  # Z-axis
                        col = 1 + pos[other_axes[0]]  # X-axis
                else:  # Front/Back faces
                    row = 1 - pos[other_axes[1]]  # Y-axis
                    col = 1 + pos[other_axes[0]]  # X-axis
                
                color = cubie.get_color(face)
                if color is not None:
                    colors[row][col] = color
        
        return colors
    
    def get_state(self):
        """Get the current state of the cube as a list of 2D arrays.
        
        Returns:
            A list of six 3x3 arrays representing the colors of each face in the order:
            [left, right, up, down, front, back] (matching FACE_INDICES)
        """
        faces = ['left', 'right', 'up', 'down', 'front', 'back']
        return [self.get_face_colors(face) for face in faces]
    
    def make_move(self, move):
        """Apply a move to the cube using standard notation.
        
        Args:
            move: The move to make ('F', 'B', 'L', 'R', 'U', 'D', "F'", "B'", "L'", "R'", "U'", "D'").
            
        Returns:
            The new state of the cube.
        """
        face_map = {
            'F': 'front',
            'B': 'back',
            'L': 'left',
            'R': 'right',
            'U': 'up',
            'D': 'down'
        }
        
        face = face_map.get(move[0])
        clockwise = not (len(move) > 1 and move[1] == "'")
        
        if not face:
            # Return the current state if the move is invalid
            return self.get_state()
        
        # Get the current state (which may be a cached/patched state)
        current_state = self.get_state()
        
        # Apply the rotation to the current state
        if clockwise:
            # Use our 2D state based approach
            new_state = self._perform_clockwise_rotation(face)
        else:
            new_state = self._perform_counterclockwise_rotation(face)
        
        # Save the new state
        self.current_state_3d = new_state
        
        return new_state
    
    def _perform_clockwise_rotation(self, face):
        """Perform a clockwise rotation of the specified face.
        
        This handles the rotation of the face itself and the adjacent edge stickers.
        
        Args:
            face: The face to rotate ('up', 'down', 'left', 'right', 'front', 'back').
            
        Returns:
            The new state of the cube after the rotation.
        """
        # Get the current 3D state and convert to 2D for easier manipulation
        current_state_3d = self.get_state()
        current_state_2d = []
        
        # Convert 3D state to 2D (flattened) state for easier manipulation
        for face_grid in current_state_3d:
            flat_face = []
            for row in face_grid:
                flat_face.extend(row)
            current_state_2d.append(flat_face)
        
        # Make a copy of the state to modify
        new_state_2d = copy.deepcopy(current_state_2d)
        
        # Get face index
        face_idx = self.FACE_INDICES[face]
        
        # 1. Rotate the face clockwise (as a 3x3 matrix)
        face_colors = current_state_2d[face_idx]
        new_face_colors = [
            face_colors[6], face_colors[3], face_colors[0],
            face_colors[7], face_colors[4], face_colors[1],
            face_colors[8], face_colors[5], face_colors[2]
        ]
        new_state_2d[face_idx] = new_face_colors
        
        # 2. Move the edge stickers
        if face in self.EDGE_STICKERS:
            edge_def = self.EDGE_STICKERS[face]
            
            # Store the current values of the edges
            edges = []
            for adj_face_name, indices in edge_def:
                adj_face_idx = self.FACE_INDICES[adj_face_name]
                edge_stickers = [current_state_2d[adj_face_idx][i] for i in indices]
                edges.append(edge_stickers)
            
            # Rotate the edges clockwise (last edge goes to first position)
            last_edge = edges.pop()
            edges.insert(0, last_edge)
            
            # Update the edges in the new state
            for i, (adj_face_name, indices) in enumerate(edge_def):
                adj_face_idx = self.FACE_INDICES[adj_face_name]
                for idx, sticker_idx in enumerate(indices):
                    new_state_2d[adj_face_idx][sticker_idx] = edges[i][idx]
        
        # Convert 2D state back to 3D format
        new_state_3d = []
        for face_colors in new_state_2d:
            face_grid = []
            for i in range(0, 9, 3):
                face_grid.append(face_colors[i:i+3])
            new_state_3d.append(face_grid)
        
        return new_state_3d
    
    def _perform_counterclockwise_rotation(self, face):
        """Perform a counterclockwise rotation of the specified face.
        
        This handles the rotation of the face itself and the adjacent edge stickers.
        
        Args:
            face: The face to rotate ('up', 'down', 'left', 'right', 'front', 'back').
            
        Returns:
            The new state of the cube after the rotation.
        """
        # Get the current 3D state and convert to 2D for easier manipulation
        current_state_3d = self.get_state()
        current_state_2d = []
        
        # Convert 3D state to 2D (flattened) state for easier manipulation
        for face_grid in current_state_3d:
            flat_face = []
            for row in face_grid:
                flat_face.extend(row)
            current_state_2d.append(flat_face)
        
        # Make a copy of the state to modify
        new_state_2d = copy.deepcopy(current_state_2d)
        
        # Get face index
        face_idx = self.FACE_INDICES[face]
        
        # 1. Rotate the face counterclockwise (as a 3x3 matrix)
        face_colors = current_state_2d[face_idx]
        new_face_colors = [
            face_colors[2], face_colors[5], face_colors[8],
            face_colors[1], face_colors[4], face_colors[7],
            face_colors[0], face_colors[3], face_colors[6]
        ]
        new_state_2d[face_idx] = new_face_colors
        
        # 2. Move the edge stickers
        if face in self.EDGE_STICKERS:
            edge_def = self.EDGE_STICKERS[face]
            
            # Store the current values of the edges
            edges = []
            for adj_face_name, indices in edge_def:
                adj_face_idx = self.FACE_INDICES[adj_face_name]
                edge_stickers = [current_state_2d[adj_face_idx][i] for i in indices]
                edges.append(edge_stickers)
            
            # Rotate the edges counterclockwise (first edge goes to last position)
            first_edge = edges.pop(0)
            edges.append(first_edge)
            
            # Update the edges in the new state
            for i, (adj_face_name, indices) in enumerate(edge_def):
                adj_face_idx = self.FACE_INDICES[adj_face_name]
                for idx, sticker_idx in enumerate(indices):
                    new_state_2d[adj_face_idx][sticker_idx] = edges[i][idx]
        
        # Convert 2D state back to 3D format
        new_state_3d = []
        for face_colors in new_state_2d:
            face_grid = []
            for i in range(0, 9, 3):
                face_grid.append(face_colors[i:i+3])
            new_state_3d.append(face_grid)
        
        return new_state_3d 