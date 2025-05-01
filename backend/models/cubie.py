class Cubie:
    """Base class for all cubies in the Rubik's cube.
    
    A cubie is an individual piece of the Rubik's cube. Each cubie has a position
    and may have one or more colors on its faces.
    """
    
    def __init__(self, position):
        """Initialize a cubie with its position.
        
        Args:
            position: A tuple (x, y, z) representing the cubie's position in 3D space.
                     Each coordinate should be -1, 0, or 1 to represent the 3x3x3 cube.
        """
        self.position = position
        self.colors = {}  # Dictionary mapping face directions to colors
    
    def get_position(self):
        """Get the cubie's position."""
        return self.position
    
    def set_color(self, face, color):
        """Set the color for a specific face of the cubie.
        
        Args:
            face: The face direction ('up', 'down', 'left', 'right', 'front', 'back').
            color: The color to set for the face.
        """
        self.colors[face] = color
    
    def get_color(self, face):
        """Get the color for a specific face of the cubie.
        
        Args:
            face: The face direction ('up', 'down', 'left', 'right', 'front', 'back').
            
        Returns:
            The color of the specified face, or None if no color is set.
        """
        return self.colors.get(face)
    
    def get_colors(self):
        """Get all colors of the cubie."""
        return self.colors
    
    def __str__(self):
        """String representation of the cubie."""
        return f"Cubie at {self.position} with colors {self.colors}"


class CenterCubie(Cubie):
    """Center cubie with only one visible face."""
    
    def __init__(self, position, face, color):
        """Initialize a center cubie.
        
        Args:
            position: A tuple (x, y, z) representing the cubie's position.
            face: The face direction ('up', 'down', 'left', 'right', 'front', 'back').
            color: The color of the center cubie.
        """
        super().__init__(position)
        self.set_color(face, color)
        self.face = face
    
    def __str__(self):
        """String representation of the center cubie."""
        return f"Center {self.face} at {self.position} with color {self.colors[self.face]}"


class EdgeCubie(Cubie):
    """Edge cubie with two visible faces."""
    
    def __init__(self, position, face1, color1, face2, color2):
        """Initialize an edge cubie.
        
        Args:
            position: A tuple (x, y, z) representing the cubie's position.
            face1: The first face direction.
            color1: The color of the first face.
            face2: The second face direction.
            color2: The color of the second face.
        """
        super().__init__(position)
        self.set_color(face1, color1)
        self.set_color(face2, color2)
        self.faces = (face1, face2)
    
    def __str__(self):
        """String representation of the edge cubie."""
        return f"Edge at {self.position} with colors {self.colors}"


class CornerCubie(Cubie):
    """Corner cubie with three visible faces."""
    
    def __init__(self, position, face1, color1, face2, color2, face3, color3):
        """Initialize a corner cubie.
        
        Args:
            position: A tuple (x, y, z) representing the cubie's position.
            face1: The first face direction.
            color1: The color of the first face.
            face2: The second face direction.
            color2: The color of the second face.
            face3: The third face direction.
            color3: The color of the third face.
        """
        super().__init__(position)
        self.set_color(face1, color1)
        self.set_color(face2, color2)
        self.set_color(face3, color3)
        self.faces = (face1, face2, face3)
    
    def __str__(self):
        """String representation of the corner cubie."""
        return f"Corner at {self.position} with colors {self.colors}" 