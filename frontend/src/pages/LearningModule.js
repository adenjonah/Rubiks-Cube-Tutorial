import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaceholderImage from '../components/PlaceholderImage';

// Base URL for all API requests
const API_BASE_URL = 'http://127.0.0.1:5000';

const LearningModule = () => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/module/${moduleId}`);
        
        // Replace image extensions if needed for demo purposes
        if (response.data.media) {
          response.data.media = response.data.media.map(item => {
            // Try to find an SVG version if PNG or GIF isn't available
            if (item.url.endsWith('.png')) {
              const svgUrl = item.url.replace('.png', '.svg');
              return { ...item, originalUrl: item.url, url: svgUrl };
            }
            return item;
          });
        }
        
        setModule(response.data);
        // Initialize answers object for each practice question
        const initialAnswers = {};
        if (response.data.practice_questions) {
          response.data.practice_questions.forEach(question => {
            initialAnswers[question.question] = '';
          });
        }
        setAnswers(initialAnswers);
        setImageErrors({});
        setLoading(false);
      } catch (err) {
        setError('Failed to load module. Please try again.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchModule();
  }, [moduleId]);

  const handleAnswerChange = (question, answer) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const handleNext = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/module/${moduleId}/complete`, {
        answers: answers
      });
      
      // Navigate to the next module or quiz
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 6) {
        navigate(`/learn/${nextModuleId}`);
      } else {
        navigate('/quiz/1');
      }
    } catch (err) {
      setError('Failed to save progress. Please try again.');
      console.error(err);
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
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

  if (!module) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
        Module not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            Module {moduleId} of 6
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{module.title}</h1>
        
        <div className="prose max-w-none mb-8">
          {module.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
        
        {module.media && module.media.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {module.media.map((item, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  {imageErrors[idx] ? (
                    <PlaceholderImage 
                      alt={item.description} 
                      className="w-full h-48"
                    />
                  ) : (
                    <img 
                      src={`/images/${item.url}`} 
                      alt={item.description} 
                      className="w-full h-auto"
                      onError={() => handleImageError(idx)}
                    />
                  )}
                  <div className="p-2 text-sm text-gray-600">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {module.practice_questions && module.practice_questions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Questions</h2>
            {module.practice_questions.map((question, idx) => (
              <div key={idx} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-3">{question.question}</p>
                
                {question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label key={optIdx} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          checked={answers[question.question] === option}
                          onChange={() => handleAnswerChange(question.question, option)}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === 'fill_in_blank' && (
                  <input
                    type="text"
                    value={answers[question.question] || ''}
                    onChange={(e) => handleAnswerChange(question.question, e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Your answer"
                  />
                )}
                
                {answers[question.question] && answers[question.question] === question.correct_answer && (
                  <div className="mt-2 text-green-600">Correct!</div>
                )}
                
                {answers[question.question] && answers[question.question] !== question.correct_answer && (
                  <div className="mt-2 text-red-600">Try again!</div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between">
          {parseInt(moduleId) > 1 && (
            <button
              onClick={() => navigate(`/learn/${parseInt(moduleId) - 1}`)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              Previous Module
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md ml-auto"
          >
            {parseInt(moduleId) < 6 ? 'Next Module' : 'Start Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningModule; 