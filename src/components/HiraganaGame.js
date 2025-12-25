import React, { useState, useEffect } from 'react';
import Game from '../components/Game';
import Profile from '../components/Profile';
import { hiraganaData } from '../data/hiragana';
import '../App.css'; 

// ✅ แก้ไข 1: รับ prop { username } เข้ามาตรงนี้
const HiraganaGame = ({ username }) => {
  const [view, setView] = useState('menu'); 
  const [useInputMode, setUseInputMode] = useState(false); 
  const [userStats, setUserStats] = useState({ history: [] });

  useEffect(() => {
    const savedStats = localStorage.getItem('hiraganaStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const handleEnd = (result) => {
    console.log("Game Ended", result);

    const newHistoryItem = {
      date: new Date().toLocaleDateString('en-GB'),
      score: result.score
    };

    const newStats = {
      ...userStats,
      history: [...userStats.history, newHistoryItem]
    };

    setUserStats(newStats);
    localStorage.setItem('hiraganaStats', JSON.stringify(newStats));
    setView('menu'); 
  };

  return (
    <div className="game-container">
      
      {/* --- MENU --- */}
      {view === 'menu' && (
        <div className="menu-screen">
          <h1>Hiragana Practice</h1>
          
          <div className="mode-selector" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={useInputMode} 
                onChange={(e) => setUseInputMode(e.target.checked)}
                style={{ transform: 'scale(1.5)' }}
              />
              เปิดโหมดพิมพ์ตอบ (ยาก) ⌨️
            </label>
          </div>

          <button className="start-btn" onClick={() => setView('game')}>
            เริ่มเกม 🚀
          </button>

          <button 
            className="text-btn" 
            style={{ marginTop: '15px', fontSize: '16px', color: '#555' }}
            onClick={() => setView('profile')}
          >
            📊 ดูสถิติพัฒนาการ
          </button>
        </div>
      )}

      {/* --- GAME --- */}
      {view === 'game' && (
        <Game 
          dataset={hiraganaData} 
          
          // ✅ แก้ไข 2: ใช้ตัวแปร username ที่รับมาจาก App.js (ถ้าไม่มีให้ใช้ Guest)
          username={username || "Guest"} 
          
          category="hiragana"
          onEnd={handleEnd} 
          onCancel={() => setView('menu')}
          inputMode={useInputMode} 
        />
      )}

      {/* --- PROFILE --- */}
      {view === 'profile' && (
        <Profile 
           history={userStats.history} 
           
           // ✅ แก้ไข 3: ส่ง username ไปโชว์ในกราฟด้วย
           username={username || "Guest Player"} 
           
           onBack={() => setView('menu')} 
        />
      )}

    </div>
  );
};

export default HiraganaGame;