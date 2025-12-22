import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import หน้าเกมและตารางต่างๆ
import HiraganaGame from './components/HiraganaGame';
import KatakanaGame from './components/KatakanaGame';
import VocabGame from './components/VocabGame';
import HiraganaChart from './components/HiraganaChart'; // เพิ่มใหม่
import KatakanaChart from './components/KatakanaChart'; // เพิ่มใหม่

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">Japanese Master 🇯🇵</h1>
        <p className="subtitle">ฝึกภาษาญี่ปุ่นวันละนิด เก่งขึ้นแน่นอน!</p>
        
        <div className="menu-grid">
          {/* โซนฝึกฝน (Games) */}
          <div className="menu-section">
            <h3>🎮 แบบฝึกหัด (Games)</h3>
            <Link to="/hiragana" className="menu-button">ฝึกฮิรางานะ (Hiragana)</Link>
            <Link to="/katakana" className="menu-button">ฝึกคาตาคานะ (Katakana)</Link>
            <Link to="/vocab" className="menu-button">ทายคำศัพท์ (Vocabulary)</Link>
          </div>

          {/* โซนความรู้ (Charts) - เพิ่มใหม่ */}
          <div className="menu-section">
            <h3>📖 ตารางตัวอักษร (Charts)</h3>
            <Link to="/chart-hiragana" className="menu-button secondary">ตารางฮิรางานะ</Link>
            <Link to="/chart-katakana" className="menu-button secondary">ตารางคาตาคานะ</Link>
          </div>
        </div>

      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hiragana" element={<HiraganaGame />} />
        <Route path="/katakana" element={<KatakanaGame />} />
        <Route path="/vocab" element={<VocabGame />} />
        {/* เพิ่ม Route สำหรับหน้าตาราง */}
        <Route path="/chart-hiragana" element={<HiraganaChart />} />
        <Route path="/chart-katakana" element={<KatakanaChart />} />
      </Routes>
    </Router>
  );
}

export default App;