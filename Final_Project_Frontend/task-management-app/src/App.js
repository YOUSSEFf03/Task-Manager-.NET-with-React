import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Dashboard from './pages/Dashboard';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;