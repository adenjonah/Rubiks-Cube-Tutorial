from flask import Flask, jsonify, request, session, render_template
from flask_cors import CORS
import json
import time
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "rubiks_cube_app_secret_key"
# Update CORS configuration to explicitly allow requests from React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

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
    if 'user_data' not in session:
        session['user_data'] = {
            'start_time': datetime.now().isoformat(),
            'current_module': 1,
            'module_times': {},
            'module_answers': {},
            'quiz_answers': {},
            'quiz_score': 0,
            'attempts': 0
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start', methods=['POST'])
def start_session():
    session.clear()
    init_user_data()
    return jsonify({'status': 'success', 'current_module': 1})

@app.route('/api/module/<int:module_id>', methods=['GET'])
def get_module(module_id):
    init_user_data()
    data = load_data()
    
    # Record the time when user starts viewing a module
    if request.method == 'GET':
        session['user_data']['module_times'][str(module_id)] = {
            'start_time': datetime.now().isoformat()
        }
        session.modified = True
    
    # Find the requested module
    module = next((m for m in data['learning_modules'] if m['id'] == module_id), None)
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    return jsonify(module)

@app.route('/api/module/<int:module_id>/complete', methods=['POST'])
def complete_module(module_id):
    init_user_data()
    
    # Record completion time and answers
    end_time = datetime.now().isoformat()
    start_time = session['user_data']['module_times'].get(str(module_id), {}).get('start_time')
    
    if start_time:
        # Calculate time spent on module
        time_spent = (datetime.fromisoformat(end_time) - 
                     datetime.fromisoformat(start_time)).total_seconds()
        
        session['user_data']['module_times'][str(module_id)]['end_time'] = end_time
        session['user_data']['module_times'][str(module_id)]['time_spent'] = time_spent
    
    # Save user answers
    answers = request.json.get('answers', {})
    session['user_data']['module_answers'][str(module_id)] = answers
    
    # Update current module
    next_module = module_id + 1
    session['user_data']['current_module'] = next_module
    session.modified = True
    
    return jsonify({'status': 'success', 'next_module': next_module})

@app.route('/api/quiz/<int:question_id>', methods=['GET'])
def get_quiz_question(question_id):
    init_user_data()
    data = load_data()
    
    # Find the requested question
    question = next((q for q in data['quiz_questions'] if q['id'] == question_id), None)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    return jsonify(question)

@app.route('/api/quiz/<int:question_id>/answer', methods=['POST'])
def submit_quiz_answer(question_id):
    init_user_data()
    data = load_data()
    
    # Find the correct question
    question = next((q for q in data['quiz_questions'] if q['id'] == question_id), None)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Save user answer
    user_answer = request.json.get('answer')
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
    init_user_data()
    data = load_data()
    
    # Calculate score
    total_questions = len(data['quiz_questions'])
    correct_answers = 0
    
    for question in data['quiz_questions']:
        q_id = str(question['id'])
        if q_id in session['user_data']['quiz_answers']:
            if session['user_data']['quiz_answers'][q_id] == question['correct_answer']:
                correct_answers += 1
    
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    session['user_data']['quiz_score'] = score
    session['user_data']['attempts'] += 1
    session.modified = True
    
    return jsonify({
        'score': score,
        'correct_answers': correct_answers,
        'total_questions': total_questions,
        'attempts': session['user_data']['attempts']
    })

@app.route('/api/reset-quiz', methods=['POST'])
def reset_quiz():
    init_user_data()
    
    # Clear quiz answers but keep module progress
    session['user_data']['quiz_answers'] = {}
    session.modified = True
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True) 