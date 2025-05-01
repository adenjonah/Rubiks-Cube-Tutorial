from flask import Blueprint, jsonify, request, session
from utils.session_manager import init_user_data, update_quiz_data
from utils.data_utils import get_quiz_question, get_all_quiz_questions

# Create a blueprint for quiz-related routes
quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/quiz/<int:question_id>', methods=['GET'])
def get_question(question_id):
    init_user_data()
    
    # Find the requested question
    question = get_quiz_question(question_id)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    return jsonify(question)

@quiz_bp.route('/quiz/<int:question_id>/answer', methods=['POST'])
def submit_quiz_answer(question_id):
    user_id = init_user_data()
    
    # Find the correct question
    question = get_quiz_question(question_id)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Save user answer
    user_answer = request.json.get('answer')
    update_quiz_data(user_id, question_id, user_answer)
    
    # Check if answer is correct
    is_correct = user_answer == question['correct_answer']
    
    # Get next question id
    next_question = None
    all_questions = get_all_quiz_questions()
    next_ids = [q['id'] for q in all_questions if q['id'] > question_id]
    if next_ids:
        next_question = min(next_ids)
    
    return jsonify({
        'is_correct': is_correct,
        'explanation': question['explanation'],
        'next_question': next_question
    })

@quiz_bp.route('/results', methods=['GET'])
def get_results():
    user_id = init_user_data()
    
    # Get global state reference for direct updates
    from utils.session_manager import global_state
    
    # Calculate score
    all_questions = get_all_quiz_questions()
    total_questions = len(all_questions)
    correct_answers = 0
    
    for question in all_questions:
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

@quiz_bp.route('/reset-quiz', methods=['POST'])
def reset_quiz():
    user_id = init_user_data()
    
    # Get global state reference for direct updates
    from utils.session_manager import global_state
    
    # Clear quiz answers but keep module progress
    global_state[user_id]['quiz_answers'] = {}
    session['user_data']['quiz_answers'] = {}
    session.modified = True
    
    return jsonify({'status': 'success'}) 