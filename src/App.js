import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Import Components
import HiraganaGame from './components/HiraganaGame';
import KatakanaGame from './components/KatakanaGame';
import VocabGame from './components/VocabGame';
import HiraganaChart from './components/HiraganaChart';
import KatakanaChart from './components/KatakanaChart';
import Dashboard from './components/Dashboard'; // ✅ เราจะใช้ Dashboard ตัวใหม่ที่เพิ่งแก้
import Login from './components/Login';         // ✅ Import หน้า Login

function Home() {
  return (
    <div className="dashboard-container">
      <header>
        <h1>Japanese Master 🇯🇵</h1>
        <p>เลือกบทเรียนเพื่อเริ่มเก็บคะแนน!</p>
      </header>
      
      {/* (ใส่โค้ดเมนู button-list เดิมของคุณตรงนี้...) */}
      {/* เพื่อความกระชับ ผมขอละไว้ แต่คุณใช้โค้ดเดิมส่วนเมนูได้เลยครับ */}
       <div className="menu-section">
        <h3>🎮 แบบฝึกหัด (Games)</h3>
        <div className="button-list">
          <Link to="/hiragana-game" className="menu-item">ฝึกฮิรางานะ (Hiragana)</Link>
          <Link to="/katakana-game" className="menu-item">ฝึกคาตาคานะ (Katakana)</Link>
          <Link to="/vocabulary-game" className="menu-item">ทายคำศัพท์ (Vocabulary)</Link>
        </div>
      </div>

      <div className="menu-section">
        <h3>📖 ตารางตัวอักษร (Charts)</h3>
        <div className="button-list">
          <Link to="/chart-hiragana" className="menu-item secondary">ตารางฮิรางานะ</Link>
          <Link to="/chart-katakana" className="menu-item secondary">ตารางคาตาคานะ</Link>
        </div>
      </div>

    </div>
  );
}

function App() {
  const [username, setUsername] = useState(null);
  const [userStats, setUserStats] = useState({ totalCorrect: 0, totalAttempts: 0 });

  // 1. โหลดชื่อและสถิติจากเครื่องเมื่อเปิดแอป
  useEffect(() => {
    const savedName = localStorage.getItem('username');
    const savedStats = localStorage.getItem('globalStats'); // เราจะรวมสถิติไว้ที่เดียวเพื่อความง่าย
    
    if (savedName) setUsername(savedName);
    if (savedStats) setUserStats(JSON.parse(savedStats));
  }, []);

  // 2. ฟังก์ชัน Login
  const handleLogin = (name) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };

  // 3. ถ้ายังไม่ Login ให้แสดงหน้า Login เท่านั้น
  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  // 4. ถ้า Login แล้ว ให้เข้าแอปปกติ
  return (
    <Router>
      <div className="app-container">
        {/* แสดง Dashboard ส่วนตัวด้านบนทุกหน้า */}
        <Dashboard stats={userStats} /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hiragana-game" element={<HiraganaGame username={username} />} />
          <Route path="/katakana-game" element={<KatakanaGame username={username} />} />
          <Route path="/vocabulary-game" element={<VocabGame username={username} />} />
          <Route path="/chart-hiragana" element={<HiraganaChart />} />
          <Route path="/chart-katakana" element={<KatakanaChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;