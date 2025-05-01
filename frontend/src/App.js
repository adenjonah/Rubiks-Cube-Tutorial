import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LearningModule from './pages/LearningModule';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Cube from './pages/Cube';
import Cube2D from './pages/Cube2D';
import StyleGuide from './pages/StyleGuide';
import Layout from './components/Layout';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/learn/:moduleId" element={<Layout><LearningModule /></Layout>} />
        <Route path="/quiz/:questionId" element={<Layout><Quiz /></Layout>} />
        <Route path="/results" element={<Layout><Results /></Layout>} />
        <Route path="/cube" element={<Layout><Cube /></Layout>} />
        <Route path="/2dcube" element={<Cube2D />} />
        <Route path="/style-guide" element={<Layout><StyleGuide /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App; 
