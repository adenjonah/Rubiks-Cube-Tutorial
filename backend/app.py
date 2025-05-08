from flask import Flask
from flask_cors import CORS
from datetime import timedelta

from config import Config
from routes.cube_routes import cube_bp
from routes.learning_routes import learning_bp
from routes.quiz_routes import quiz_bp

# Create and configure the app
app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = 'supersecretkey'

# Configure CORS
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5000"]}}, 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Accept"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     expose_headers=["Set-Cookie"])

# Configure session cookie settings for cross-origin requests
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = None  # Required for cross-origin requests
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # Sessions last for 1 day

# Register blueprints
app.register_blueprint(cube_bp, url_prefix='/api/cube')
app.register_blueprint(learning_bp, url_prefix='/api')
app.register_blueprint(quiz_bp, url_prefix='/api')

# Root route
@app.route('/')
def index():
    from flask import render_template
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True) 