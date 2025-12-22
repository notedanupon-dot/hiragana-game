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
    <div className="dashboard-container">
  <h1>Japanese Master 🇯🇵</h1>
  <p>ฝึกภาษาญี่ปุ่นวันละนิด เก่งขึ้นแน่นอน!</p>

  {/* --- ส่วนที่ 1: เกม --- */}
  <div className="menu-section">
    <h3>🎮 แบบฝึกหัด (Games)</h3>
    <div className="button-list">
      <Link to="/hiragana-game" className="menu-item">
        ฝึกฮิรางานะ (Hiragana)
      </Link>
      <Link to="/katakana-game" className="menu-item">
        ฝึกคาตาคานะ (Katakana)
      </Link>
      <Link to="/vocabulary-game" className="menu-item">
        ทายคำศัพท์ (Vocabulary)
      </Link>
    </div>
  </div>

  {/* --- ส่วนที่ 2: ตาราง --- */}
  <div className="menu-section">
    <h3>📖 ตารางตัวอักษร (Charts)</h3>
    <div className="button-list">
      <Link to="/chart-hiragana" className="menu-item secondary">
        ตารางฮิรางานะ
      </Link>
      <Link to="/chart-katakana" className="menu-item secondary">
        ตารางคาตาคานะ
      </Link>
    </div>
  </div>
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