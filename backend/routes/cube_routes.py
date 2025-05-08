from flask import Blueprint, jsonify, request
from utils.session_manager import init_user_data, get_cube_state, set_cube_state
from models.cube import RubiksCube
from utils.cube_state_adapter import convert_3d_to_2d_state, create_cube_from_2d_state
import json

# Create a blueprint for cube-related routes
cube_bp = Blueprint('cube', __name__)

# Store cube instances in memory
cube_instances = {}

def get_cube_instance(user_id):
    """Get a RubiksCube instance from the current session state."""
    # Always rebuild the cube instance from the current session state
    current_state = get_cube_state(user_id)
    cube = create_cube_from_2d_state(current_state)
    return cube

@cube_bp.route('/move', methods=['POST'])
def make_cube_move():
    user_id = init_user_data()
    move = request.json.get('move')
    current_state = request.json.get('currentState')
    
    if not move:
        return jsonify({'error': 'No move specified'}), 400
    
    # Use the state sent from the frontend if available, otherwise use the session state
    if current_state and isinstance(current_state, list) and len(current_state) == 6:
        print(f"Using state from frontend request for move {move}")
        # Update the session state with the frontend state
        set_cube_state(user_id, current_state)
    else:
        current_state = get_cube_state(user_id)
        print(f"Using state from session for move {move}")
    
    # Create a cube instance using the provided state
    cube = create_cube_from_2d_state(current_state)
    
    # Print current state for debugging
    print(f"Before {move} - 3D state:", json.dumps(cube.get_state()))
    initial_2d_state = convert_3d_to_2d_state(cube.get_state())
    print(f"Before {move} - 2D state:", json.dumps(initial_2d_state))
    
    # Apply the move to the 3D cube model
    new_3d_state = cube.make_move(move)
    
    # Convert to 2D representation
    new_2d_state = convert_3d_to_2d_state(new_3d_state)
    
    # Print after state for debugging
    print(f"After {move} - 3D state:", json.dumps(new_3d_state))
    print(f"After {move} - 2D state:", json.dumps(new_2d_state))
    
    # Update session state
    set_cube_state(user_id, new_2d_state)
    
    return jsonify({
        'status': 'success',
        'cubeState': new_2d_state
    })

@cube_bp.route('/reset', methods=['POST'])
def reset_cube():
    user_id = init_user_data()
    
    # Create a new solved cube
    new_cube = RubiksCube()
    
    # Get the 3D state and convert to 2D
    new_3d_state = new_cube.get_state()
    new_2d_state = convert_3d_to_2d_state(new_3d_state)
    
    # Update session state
    set_cube_state(user_id, new_2d_state)
    
    return jsonify({
        'status': 'success',
        'cubeState': new_2d_state
    })

@cube_bp.route('/state', methods=['GET'])
def get_current_cube_state():
    user_id = init_user_data()
    
    # Get the cube instance and its current state
    cube = get_cube_instance(user_id)
    current_3d_state = cube.get_state()
    current_2d_state = convert_3d_to_2d_state(current_3d_state)
    
    # Update session state to ensure consistency
    set_cube_state(user_id, current_2d_state)
    
    return jsonify({
        'status': 'success',
        'cubeState': current_2d_state
    }) 