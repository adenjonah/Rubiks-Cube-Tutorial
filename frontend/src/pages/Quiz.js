import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Base URL for all API requests
const API_BASE_URL = 'http://127.0.0.1:5000';

const Quiz = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setFeedback(null);
        setIsSubmitted(false);
        const response = await axios.get(`${API_BASE_URL}/api/quiz/${questionId}`);
        setQuestion(response.data);
        setUserAnswer('');
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz question. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleOptionChange = (option) => {
    setUserAnswer(option);
  };

  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quiz/${questionId}/answer`, {
        answer: userAnswer
      });
      
      setFeedback({
        isCorrect: response.data.isCorrect,
        explanation: response.data.explanation
      });
      
      setIsSubmitted(true);
      
      // Navigate to next question or results page
      if (response.data.next_question) {
        setTimeout(() => {
          navigate(`/quiz/${response.data.next_question}`);
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/results');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
    }
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

  if (!question) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
        Question not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Question {questionId} of 8
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h1>
        
        <div className="mb-8">
          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    userAnswer === option ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="quizOption"
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleOptionChange(option)}
                    className="mr-3"
                    disabled={isSubmitted}
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}
          
          {question.type === 'fill_in_blank' && (
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              placeholder="Type your answer here"
              disabled={isSubmitted}
            />
          )}
        </div>
        
        {feedback && (
          <div className={`p-4 mb-6 rounded-md ${
            feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium mb-2">
              {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p>{feedback.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Back
          </button>
          
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className={`font-medium py-2 px-6 rounded-md ${
                userAnswer ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-200 text-white cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <div className="text-gray-600">
              {question.id < 8 ? 'Next question loading...' : 'Loading results...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 