from flask import session
import time
from datetime import datetime
import copy
import uuid

# Global state dictionary as a fallback for session
global_state = {}

# Initialize user session data
def init_user_data():
    """Initialize user session data and return user_id"""
    # Print session info for debugging
    print("Session before:", session.get('user_id', 'No user_id in session'), "Session contents:", dict(session))
    
    # Generate a unique user ID if not present
    if 'user_id' not in session:
        print("Creating new user_id - session cookie not found")
        # Use a UUID for more reliable session IDs
        session['user_id'] = str(uuid.uuid4())
        session.modified = True
        session.permanent = True  # Make session persist longer
    else:
        print(f"Reusing existing user_id: {session['user_id']}")
    
    user_id = session['user_id']
    
    # Initialize the global state for this user if not present
    if user_id not in global_state:
        print(f"Initializing global state for user {user_id}")
        global_state[user_id] = {
            'start_time': datetime.now().isoformat(),
            'current_module': 1,
            'module_times': {},
            'module_answers': {},
            'quiz_answers': {},
            'quiz_score': 0,
            'attempts': 0,
            'cube_state': [
                ['green'] * 9,   # Left (0)
                ['blue'] * 9,    # Right (1)
                ['white'] * 9,   # Up (2)
                ['yellow'] * 9,  # Down (3)
                ['red'] * 9,     # Front (4)
                ['orange'] * 9   # Back (5)
            ]
        }
    
    # Initialize session data if not present
    if 'user_data' not in session:
        print(f"Initializing session user_data for user {user_id}")
        session['user_data'] = global_state[user_id]
        session.modified = True
    
    print("Session after:", session.get('user_id', 'No user_id in session'), "Session modified:", session.modified)
    
    return user_id

# Get the user's cube state
def get_cube_state(user_id):
    if user_id in global_state:
        return copy.deepcopy(global_state[user_id]['cube_state'])
    else:
        # Return default state if user_id not found
        print(f"User {user_id} not found in global state, returning default state")
        return [
            ['green'] * 9,   # Left (0)
            ['blue'] * 9,    # Right (1)
            ['white'] * 9,   # Up (2)
            ['yellow'] * 9,  # Down (3)
            ['red'] * 9,     # Front (4)
            ['orange'] * 9   # Back (5)
        ]

# Set the user's cube state
def set_cube_state(user_id, new_state):
    # Update both global state and session
    if user_id not in global_state:
        # If user_id not in global state, initialize it
        init_user_data()
    
    global_state[user_id]['cube_state'] = copy.deepcopy(new_state)
    
    if 'user_data' in session:
        session['user_data']['cube_state'] = copy.deepcopy(new_state)
        session.modified = True
    print(f"Updated state for user {user_id}: {global_state[user_id]['cube_state']}")

# Get/set user progress data
def update_user_module(user_id, module_id, next_module=None):
    if next_module:
        global_state[user_id]['current_module'] = next_module
        session['user_data']['current_module'] = next_module
        session.modified = True
    return global_state[user_id]['current_module']

# Update user quiz data
def update_quiz_data(user_id, question_id=None, answer=None):
    if question_id and answer:
        global_state[user_id]['quiz_answers'][str(question_id)] = answer
        session['user_data']['quiz_answers'][str(question_id)] = answer
        session.modified = True
    return global_state[user_id]['quiz_answers'] 