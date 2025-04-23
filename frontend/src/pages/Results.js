import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Base URL for all API requests
const API_BASE_URL = 'http://127.0.0.1:5000';

const Results = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/results`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load results. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchResults();
  }, []);

  const handleRetakeQuiz = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/reset-quiz`);
      navigate('/quiz/1');
    } catch (err) {
      setError('Failed to reset quiz. Please try again.');
      console.error(err);
    }
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! You\'ve mastered the white side.';
    if (score >= 70) return 'Great job! You have a solid understanding.';
    if (score >= 50) return 'Good effort! Review the areas you missed.';
    return 'Keep practicing! Review the learning modules and try again.';
  };
  
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
        No results available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Results</h1>
        
        <div className="mb-8 text-center">
          <div className="text-6xl font-bold mb-2 transition-all duration-500 ease-in-out transform hover:scale-110 inline-block">
            <span className={getScoreColor(results.score)}>
              {Math.round(results.score)}%
            </span>
          </div>
          <p className="text-xl text-gray-600">{getScoreMessage(results.score)}</p>
        </div>
        
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{results.correct_answers}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Total Questions</p>
              <p className="text-2xl font-bold text-blue-600">{results.total_questions}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Attempts</p>
              <p className="text-2xl font-bold text-purple-600">{results.attempts}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500 text-sm">Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(results.score)}`}>
                {Math.round(results.score)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">What's Next?</h2>
          <p className="text-blue-700 mb-3">
            Now that you've learned how to solve the white side of the Rubik's Cube, you can:
          </p>
          <ul className="list-disc ml-6 text-blue-700 space-y-2">
            <li>Practice solving the white side on a real Rubik's Cube</li>
            <li>Review any modules you found challenging</li>
            <li>Continue learning to solve the entire cube</li>
            <li>Challenge yourself to solve the white side faster</li>
          </ul>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/learn/1')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Review Lessons
          </button>
          
          <button
            onClick={handleRetakeQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 