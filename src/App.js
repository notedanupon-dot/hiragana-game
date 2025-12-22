import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HiraganaGame from './components/HiraganaGame';
import KatakanaGame from './components/KatakanaGame';
import VocabGame from './components/VocabGame';

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้าแรกคือเมนู */}
        <Route path="/" element={<Home />} />
        
        {/* หน้าแยกตามเกม */}
        <Route path="/hiragana" element={<HiraganaGame />} />
        <Route path="/katakana" element={<KatakanaGame />} />
        <Route path="/vocab" element={<VocabGame />} />
      </Routes>
    </Router>
  );
}

export default App;