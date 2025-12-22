import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import หน้าเกมและตารางต่างๆ
import HiraganaGame from './components/HiraganaGame';
import KatakanaGame from './components/KatakanaGame';
import VocabGame from './components/VocabGame';
import HiraganaChart from './components/HiraganaChart';
import KatakanaChart from './components/KatakanaChart';

function Home() {
  return (
    <div className="dashboard-container">
      <header>
        <h1>Japanese Master 🇯🇵</h1>
        <p>ฝึกภาษาญี่ปุ่นวันละนิด เก่งขึ้นแน่นอน!</p>
      </header>

      {/* --- ส่วนที่ 1: เกม --- */}
      <div className="menu-section">
        <h3>🎮 แบบฝึกหัด (Games)</h3>
        <div className="button-list">
          {/* ✅ ลิงก์พวกนี้ถูกต้องแล้ว รอไปจับคู่กับ Route ด้านล่าง */}
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
      {/* ✅ เพิ่ม app-container ตรงนี้ เพื่อให้ทุกหน้า (ทั้ง Home และ Game) อยู่ตรงกลางและสวยงาม */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* ✅ แก้ไข Path ตรงนี้ให้ตรงกับ Link ด้านบน (เดิมเขียนว่า /hiragana เฉยๆ) */}
          <Route path="/hiragana-game" element={<HiraganaGame />} />
          <Route path="/katakana-game" element={<KatakanaGame />} />
          <Route path="/vocabulary-game" element={<VocabGame />} />

          {/* ส่วนตารางถูกต้องแล้ว */}
          <Route path="/chart-hiragana" element={<HiraganaChart />} />
          <Route path="/chart-katakana" element={<KatakanaChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;