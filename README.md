# Rubik's Cube White Side Solver

An interactive educational application that teaches users how to solve the white side of a Rubik's Cube through guided learning modules and quizzes.

## Project Structure

```
rubiks-cube-app/
├── backend/                 # Flask backend
│   ├── app.py               # Main Flask application
│   ├── data.json            # Learning module and quiz data
│   ├── requirements.txt     # Python dependencies
│   ├── static/              # Static files (styles, scripts)
│   └── templates/           # HTML templates
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   │   └── images/          # Images for the app
│   └── src/                 # React source code
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── App.js           # Main App component
│       └── index.js         # Entry pointto app
└── README.md                # Project documentation
```

## Features

- Interactive learning modules guiding users through the process
- Step-by-step instructions with supporting images and GIFs
- Practice questions throughout the learning modules
- Comprehensive quiz to test knowledge
- Detailed results page with score and feedback
- User progress tracking

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required packages:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application should now be running at http://localhost:3000

## Usage Flow

1. Start at the home page and click "Start Learning"
2. Progress through each learning module at your own pace
3. Answer practice questions in each module
4. Take the quiz to test your knowledge
5. View your results and retake the quiz if needed

## Future Enhancements

- 3D interactive Rubik's Cube model
- Additional learning modules for solving the entire cube
- User accounts and progress saving
- Timed challenges
- Mobile-responsive design 
