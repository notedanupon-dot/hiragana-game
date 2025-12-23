import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import Components
import HiraganaGame from './components/HiraganaGame';
import KatakanaGame from './components/KatakanaGame'; // (เปิดใช้เมื่อมีไฟล์แล้ว)
import VocabGame from './components/VocabGame';       // (เปิดใช้เมื่อมีไฟล์แล้ว)
import HiraganaChart from './components/HiraganaChart'; // (เปิดใช้เมื่อมีไฟล์แล้ว)
import KatakanaChart from './components/KatakanaChart'; // (เปิดใช้เมื่อมีไฟล์แล้ว)
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';

// หน้าแรก (เมนูหลัก)
function Home() {
  return (
    
    <div className="dashboard-container">
      {/* 1. วาง Leaderboard ไว้บนสุด ตรงนี้เลยครับ */}
      <Leaderboard />
      <header>
        <h1>Japanese Master 🇯🇵</h1>
        <p>เลือกบทเรียนเพื่อเริ่มเก็บคะแนน!</p>
      </header>
      
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

  // 1. เช็ค Login เมื่อเปิดแอป
  useEffect(() => {
    const savedName = localStorage.getItem('username');
    if (savedName) setUsername(savedName);
  }, []);

  // 2. ฟังก์ชัน Login
  const handleLogin = (name) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };

  // 3. ฟังก์ชัน Logout (แถมให้: เพื่อความสะดวกในการทดสอบ)
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
  };

  // ถ้ายังไม่ Login ให้โชว์หน้า Login
  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  // ถ้า Login แล้ว ให้เข้าสู่ระบบ Routing
  return (
    <Router>
      <div className="app-container">
        
        {/* Navbar เล็กๆ ด้านบน เพื่อบอกว่าใคร Login อยู่ และปุ่มกลับหน้าแรก */}
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '10px 20px', 
          background: '#f0f2f5',
          marginBottom: '20px'
        }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#333' }}>🏠 หน้าหลัก</Link>
          </div>
          <div>
            👤 {username} | <button onClick={handleLogout} style={{cursor: 'pointer', border:'none', background:'none', color:'red'}}>ออก</button>
          </div>
        </nav>

        {/* ส่วนแสดงผลเปลี่ยนไปตาม Route */}
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* ส่ง username เข้าไปในเกมด้วย เพื่อใช้บันทึก Firebase */}
          <Route path="/hiragana-game" element={<HiraganaGame username={username} />} />
          <Route path="/vocabulary-game" element={<VocabGame username={username} />} />
          <Route path="/chart-hiragana" element={<HiraganaChart />} /> // ✅ ต้องไม่มี //
          <Route path="/chart-katakana" element={<KatakanaChart />} /> // ✅ ต้องไม่มี //
          <Route path="/katakana-game" element={<KatakanaGame username={username} />} />

          {/* (ใส่ Comment ไว้ก่อนกัน Error จนกว่าจะสร้างไฟล์เสร็จ) */}
          {/* <Route path="/katakana-game" element={<KatakanaGame username={username} />} /> */}
          {/* <Route path="/vocabulary-game" element={<VocabGame username={username} />} /> */}
          {/* <Route path="/chart-hiragana" element={<HiraganaChart />} /> */}
          {/* <Route path="/chart-katakana" element={<KatakanaChart />} /> */}
        </Routes>

      </div>
    </Router>
  );
}

export default App;