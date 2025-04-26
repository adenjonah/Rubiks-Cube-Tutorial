import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LearningModule from './pages/LearningModule';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Cube from './pages/Cube';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:moduleId" element={<LearningModule />} />
            <Route path="/quiz/:questionId" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/cube" element={<Cube />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 
