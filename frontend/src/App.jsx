import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import UploadResume from './pages/UploadResume';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Background from './components/Background';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pt-16 text-white font-sans bg-transparent">
        <Background />
        <Navbar />
        <main className="flex-grow flex flex-col relative w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/upload" element={<UploadResume />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
