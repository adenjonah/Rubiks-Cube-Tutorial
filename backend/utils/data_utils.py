import json
import os

# Load data from JSON file
def load_data():
    try:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data.json'), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "learning_modules": [],
            "quiz_questions": []
        }

# Get a specific learning module by ID
def get_learning_module(module_id):
    data = load_data()
    return next((m for m in data['learning_modules'] if m['id'] == module_id), None)

# Get a specific quiz question by ID
def get_quiz_question(question_id):
    data = load_data()
    return next((q for q in data['quiz_questions'] if q['id'] == question_id), None)

# Get all quiz questions
def get_all_quiz_questions():
    data = load_data()
    return data['quiz_questions'] 