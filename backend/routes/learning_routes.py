from flask import Blueprint, jsonify, request, session
from datetime import datetime
from utils.session_manager import init_user_data, update_user_module
from utils.data_utils import load_data, get_learning_module

# Create a blueprint for learning-related routes
learning_bp = Blueprint('learning', __name__)

@learning_bp.route('/start', methods=['POST'])
def start_session():
    session.clear()
    user_id = init_user_data()
    return jsonify({'status': 'success', 'current_module': 1})

@learning_bp.route('/module/<int:module_id>', methods=['GET'])
def get_module(module_id):
    user_id = init_user_data()
    
    # Record the time when user starts viewing a module
    from utils.session_manager import global_state
    if request.method == 'GET':
        global_state[user_id]['module_times'][str(module_id)] = {
            'start_time': datetime.now().isoformat()
        }
        session['user_data']['module_times'][str(module_id)] = global_state[user_id]['module_times'][str(module_id)]
        session.modified = True
    
    # Find the requested module
    module = get_learning_module(module_id)
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    return jsonify(module)

@learning_bp.route('/module/<int:module_id>/complete', methods=['POST'])
def complete_module(module_id):
    user_id = init_user_data()
    
    # Record completion time and answers
    end_time = datetime.now().isoformat()
    
    # Get global state reference for direct updates
    from utils.session_manager import global_state
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
    update_user_module(user_id, module_id, next_module)
    
    return jsonify({'status': 'success', 'next_module': next_module}) 