from flask import Flask, jsonify, request, session, render_template
from flask_cors import CORS
import json
import time
import os
from datetime import datetime
import copy

app = Flask(__name__)
app.secret_key = "rubiks_cube_app_secret_key"
# Update CORS configuration to explicitly allow requests from the React frontend with credentials
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Global state dictionary as a fallback for session
global_state = {}

# Load data from JSON file
def load_data():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'data.json'), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "learning_modules": [],
            "quiz_questions": []
        }

# Initialize user session data
def init_user_data():
    # Generate a unique user ID if not present
    if 'user_id' not in session:
        session['user_id'] = str(time.time())
        
    user_id = session['user_id']
    
    # Initialize the global state for this user if not present
    if user_id not in global_state:
        global_state[user_id] = {
            'start_time': datetime.now().isoformat(),
            'current_module': 1,
            'module_times': {},
            'module_answers': {},
            'quiz_answers': {},
            'quiz_score': 0,
            'attempts': 0,
            'cube_state': [
                ['blue'] * 9,    # Right (0)
                ['green'] * 9,   # Left (1)
                ['white'] * 9,   # Up (2)
                ['yellow'] * 9,  # Down (3)
                ['red'] * 9,     # Front (4)
                ['orange'] * 9   # Back (5)
            ]
        }
    
    # Initialize session data if not present
    if 'user_data' not in session:
        session['user_data'] = global_state[user_id]
        session.modified = True
        
    return user_id

# Get the user's cube state
def get_cube_state(user_id):
    return copy.deepcopy(global_state[user_id]['cube_state'])

# Set the user's cube state
def set_cube_state(user_id, new_state):
    # Update both global state and session
    global_state[user_id]['cube_state'] = copy.deepcopy(new_state)
    if 'user_data' in session:
        session['user_data']['cube_state'] = copy.deepcopy(new_state)
        session.modified = True
    print(f"Updated state for user {user_id}: {global_state[user_id]['cube_state']}")

# Cube move handling functions
def rotate_face_clockwise(face):
    # Rotate a face 90 degrees clockwise
    return [
        face[6], face[3], face[0],
        face[7], face[4], face[1],
        face[8], face[5], face[2]
    ]

def rotate_face_counterclockwise(face):
    # Rotate a face 90 degrees counterclockwise
    return [
        face[2], face[5], face[8],
        face[1], face[4], face[7],
        face[0], face[3], face[6]
    ]

def handle_cube_move(move, cube_state):
    # Create a deep copy of the cube state
    new_state = [face[:] for face in cube_state]
    print(f"Before move {move}: {cube_state}")

    if move == 'F':
        new_state[4] = rotate_face_clockwise(cube_state[4])
        # Read from original state only
        right_temp = [cube_state[0][0], cube_state[0][3], cube_state[0][6]]
        up_temp = [cube_state[2][6], cube_state[2][7], cube_state[2][8]]
        left_temp = [cube_state[1][2], cube_state[1][5], cube_state[1][8]]
        down_temp = [cube_state[3][0], cube_state[3][1], cube_state[3][2]]
        new_state[0][0] = up_temp[0]
        new_state[0][3] = up_temp[1]
        new_state[0][6] = up_temp[2]
        new_state[3][0] = right_temp[2]
        new_state[3][1] = right_temp[1]
        new_state[3][2] = right_temp[0]
        new_state[1][2] = down_temp[0]
        new_state[1][5] = down_temp[1]
        new_state[1][8] = down_temp[2]
        new_state[2][6] = left_temp[2]
        new_state[2][7] = left_temp[1]
        new_state[2][8] = left_temp[0]
    elif move == 'B':
        new_state[5] = rotate_face_clockwise(cube_state[5])
        right_temp = [cube_state[0][2], cube_state[0][5], cube_state[0][8]]
        up_temp = [cube_state[2][0], cube_state[2][1], cube_state[2][2]]
        left_temp = [cube_state[1][0], cube_state[1][3], cube_state[1][6]]
        down_temp = [cube_state[3][6], cube_state[3][7], cube_state[3][8]]
        new_state[1][0] = up_temp[0]
        new_state[1][3] = up_temp[1]
        new_state[1][6] = up_temp[2]
        new_state[3][6] = left_temp[2]
        new_state[3][7] = left_temp[1]
        new_state[3][8] = left_temp[0]
        new_state[0][2] = down_temp[0]
        new_state[0][5] = down_temp[1]
        new_state[0][8] = down_temp[2]
        new_state[2][0] = right_temp[2]
        new_state[2][1] = right_temp[1]
        new_state[2][2] = right_temp[0]
    elif move == 'R':
        new_state[0] = rotate_face_clockwise(cube_state[0])
        up_temp = [cube_state[2][2], cube_state[2][5], cube_state[2][8]]
        front_temp = [cube_state[4][2], cube_state[4][5], cube_state[4][8]]
        down_temp = [cube_state[3][2], cube_state[3][5], cube_state[3][8]]
        back_temp = [cube_state[5][0], cube_state[5][3], cube_state[5][6]]
        new_state[4][2] = up_temp[0]
        new_state[4][5] = up_temp[1]
        new_state[4][8] = up_temp[2]
        new_state[3][2] = front_temp[0]
        new_state[3][5] = front_temp[1]
        new_state[3][8] = front_temp[2]
        new_state[5][0] = down_temp[2]
        new_state[5][3] = down_temp[1]
        new_state[5][6] = down_temp[0]
        new_state[2][2] = back_temp[2]
        new_state[2][5] = back_temp[1]
        new_state[2][8] = back_temp[0]
    elif move == 'L':
        new_state[1] = rotate_face_clockwise(cube_state[1])
        up_temp = [cube_state[2][0], cube_state[2][3], cube_state[2][6]]
        front_temp = [cube_state[4][0], cube_state[4][3], cube_state[4][6]]
        down_temp = [cube_state[3][0], cube_state[3][3], cube_state[3][6]]
        back_temp = [cube_state[5][2], cube_state[5][5], cube_state[5][8]]
        new_state[5][2] = up_temp[2]
        new_state[5][5] = up_temp[1]
        new_state[5][8] = up_temp[0]
        new_state[3][0] = back_temp[2]
        new_state[3][3] = back_temp[1]
        new_state[3][6] = back_temp[0]
        new_state[4][0] = down_temp[0]
        new_state[4][3] = down_temp[1]
        new_state[4][6] = down_temp[2]
        new_state[2][0] = front_temp[0]
        new_state[2][3] = front_temp[1]
        new_state[2][6] = front_temp[2]
    elif move == 'U':
        new_state[2] = rotate_face_clockwise(cube_state[2])
        front_temp = [cube_state[4][0], cube_state[4][1], cube_state[4][2]]
        right_temp = [cube_state[0][0], cube_state[0][1], cube_state[0][2]]
        back_temp = [cube_state[5][0], cube_state[5][1], cube_state[5][2]]
        left_temp = [cube_state[1][0], cube_state[1][1], cube_state[1][2]]
        new_state[1][0] = front_temp[0]
        new_state[1][1] = front_temp[1]
        new_state[1][2] = front_temp[2]
        new_state[5][0] = left_temp[0]
        new_state[5][1] = left_temp[1]
        new_state[5][2] = left_temp[2]
        new_state[0][0] = back_temp[0]
        new_state[0][1] = back_temp[1]
        new_state[0][2] = back_temp[2]
        new_state[4][0] = right_temp[0]
        new_state[4][1] = right_temp[1]
        new_state[4][2] = right_temp[2]
    elif move == 'D':
        new_state[3] = rotate_face_clockwise(cube_state[3])
        front_temp = [cube_state[4][6], cube_state[4][7], cube_state[4][8]]
        right_temp = [cube_state[0][6], cube_state[0][7], cube_state[0][8]]
        back_temp = [cube_state[5][6], cube_state[5][7], cube_state[5][8]]
        left_temp = [cube_state[1][6], cube_state[1][7], cube_state[1][8]]
        new_state[0][6] = front_temp[0]
        new_state[0][7] = front_temp[1]
        new_state[0][8] = front_temp[2]
        new_state[5][6] = right_temp[0]
        new_state[5][7] = right_temp[1]
        new_state[5][8] = right_temp[2]
        new_state[1][6] = back_temp[0]
        new_state[1][7] = back_temp[1]
        new_state[1][8] = back_temp[2]
        new_state[4][6] = left_temp[0]
        new_state[4][7] = left_temp[1]
        new_state[4][8] = left_temp[2]
    elif move in ['F\'', 'B\'', 'L\'', 'R\'', 'U\'', 'D\'']:
        base_move = move[0]
        for _ in range(3):
            new_state = handle_cube_move(base_move, new_state)
    
    print(f"After move {move}: {new_state}")
    # Verify the state has actually changed
    changed = new_state != cube_state
    print(f"State changed: {changed}")
    return new_state

@app.route('/api/cube/move', methods=['POST'])
def make_cube_move():
    user_id = init_user_data()
    move = request.json.get('move')
    
    if not move:
        return jsonify({'error': 'No move specified'}), 400
    
    # Get current state and apply move
    current_state = get_cube_state(user_id)
    new_state = handle_cube_move(move, current_state)
    
    # Check if the state changed
    if current_state == new_state:
        print("WARNING: Cube state did not change after move!")
    
    # Update both session and global state with the new state
    set_cube_state(user_id, new_state)
    
    return jsonify({
        'status': 'success',
        'cubeState': new_state
    })

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start', methods=['POST'])
def start_session():
    session.clear()
    user_id = init_user_data()
    return jsonify({'status': 'success', 'current_module': 1})

@app.route('/api/module/<int:module_id>', methods=['GET'])
def get_module(module_id):
    user_id = init_user_data()
    data = load_data()
    
    # Record the time when user starts viewing a module
    if request.method == 'GET':
        global_state[user_id]['module_times'][str(module_id)] = {
            'start_time': datetime.now().isoformat()
        }
        session['user_data']['module_times'][str(module_id)] = global_state[user_id]['module_times'][str(module_id)]
        session.modified = True
    
    # Find the requested module
    module = next((m for m in data['learning_modules'] if m['id'] == module_id), None)
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    return jsonify(module)

@app.route('/api/module/<int:module_id>/complete', methods=['POST'])
def complete_module(module_id):
    user_id = init_user_data()
    
    # Record completion time and answers
    end_time = datetime.now().isoformat()
    start_time = global_state[user_id]['module_times'].get(str(module_id), {}).get('start_time')
    
    if start_time:
        # Calculate time spent on module
        time_spent = (datetime.fromisoformat(end_time) - 
                     datetime.fromisoformat(start_time)).total_seconds()
        
        global_state[user_id]['module_times'][str(module_id)]['end_time'] = end_time
        global_state[user_id]['module_times'][str(module_id)]['time_spent'] = time_spent
        
        session['user_data']['module_times'][str(module_id)] = global_state[user_id]['module_times'][str(module_id)]
    
    # Save user answers
    answers = request.json.get('answers', {})
    global_state[user_id]['module_answers'][str(module_id)] = answers
    session['user_data']['module_answers'][str(module_id)] = answers
    
    # Update current module
    next_module = module_id + 1
    global_state[user_id]['current_module'] = next_module
    session['user_data']['current_module'] = next_module
    session.modified = True
    
    return jsonify({'status': 'success', 'next_module': next_module})

@app.route('/api/quiz/<int:question_id>', methods=['GET'])
def get_quiz_question(question_id):
    user_id = init_user_data()
    data = load_data()
    
    # Find the requested question
    question = next((q for q in data['quiz_questions'] if q['id'] == question_id), None)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    return jsonify(question)

@app.route('/api/quiz/<int:question_id>/answer', methods=['POST'])
def submit_quiz_answer(question_id):
    user_id = init_user_data()
    data = load_data()
    
    # Find the correct question
    question = next((q for q in data['quiz_questions'] if q['id'] == question_id), None)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Save user answer
    user_answer = request.json.get('answer')
    global_state[user_id]['quiz_answers'][str(question_id)] = user_answer
    session['user_data']['quiz_answers'][str(question_id)] = user_answer
    
    # Check if answer is correct
    is_correct = user_answer == question['correct_answer']
    
    # Get next question id
    next_question = None
    next_ids = [q['id'] for q in data['quiz_questions'] if q['id'] > question_id]
    if next_ids:
        next_question = min(next_ids)
    
    # Update session
    session.modified = True
    
    return jsonify({
        'is_correct': is_correct,
        'explanation': question['explanation'],
        'next_question': next_question
    })

@app.route('/api/results', methods=['GET'])
def get_results():
    user_id = init_user_data()
    data = load_data()
    
    # Calculate score
    total_questions = len(data['quiz_questions'])
    correct_answers = 0
    
    for question in data['quiz_questions']:
        q_id = str(question['id'])
        if q_id in global_state[user_id]['quiz_answers']:
            if global_state[user_id]['quiz_answers'][q_id] == question['correct_answer']:
                correct_answers += 1
    
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    global_state[user_id]['quiz_score'] = score
    global_state[user_id]['attempts'] += 1
    
    session['user_data']['quiz_score'] = score
    session['user_data']['attempts'] = global_state[user_id]['attempts']
    session.modified = True
    
    return jsonify({
        'score': score,
        'correct_answers': correct_answers,
        'total_questions': total_questions,
        'attempts': global_state[user_id]['attempts']
    })

@app.route('/api/reset-quiz', methods=['POST'])
def reset_quiz():
    user_id = init_user_data()
    
    # Clear quiz answers but keep module progress
    global_state[user_id]['quiz_answers'] = {}
    session['user_data']['quiz_answers'] = {}
    session.modified = True
    
    return jsonify({'status': 'success'})

@app.route('/api/cube/reset', methods=['POST'])
def reset_cube():
    user_id = init_user_data()
    
    # Reset cube to solved state
    solved_state = [
        ['blue'] * 9,    # Right
        ['green'] * 9,   # Left
        ['white'] * 9,   # Up
        ['yellow'] * 9,  # Down
        ['red'] * 9,     # Front
        ['orange'] * 9   # Back
    ]
    
    # Update both global state and session
    set_cube_state(user_id, solved_state)
    
    return jsonify({
        'status': 'success',
        'cubeState': solved_state
    })

@app.route('/api/cube/state', methods=['GET'])
def get_current_cube_state():
    user_id = init_user_data()
    current_state = get_cube_state(user_id)
    
    return jsonify({
        'status': 'success',
        'cubeState': current_state
    })

if __name__ == '__main__':
    app.run(debug=True) 