import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;