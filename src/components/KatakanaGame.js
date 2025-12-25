import React, { useState, useEffect } from 'react';
import { katakanaData } from '../data/katakana';
import Game from '../components/Game';
import Profile from '../components/Profile';
import '../App.css'; 

const KatakanaGame = ({ username }) => {
  const [view, setView] = useState('menu'); 
  const [useInputMode, setUseInputMode] = useState(false);
  const [userStats, setUserStats] = useState({ history: [] });

  // กรองข้อมูล: เอาเฉพาะที่มีตัวอักษร
  const activeGameData = katakanaData.filter(item => item.character && item.character !== '');

  // โหลดข้อมูลเก่าจาก LocalStorage (ใช้ key 'katakanaStats')
  useEffect(() => {
    const savedStats = localStorage.getItem('katakanaStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // ฟังก์ชันเมื่อจบเกม
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

    // บันทึกลง LocalStorage
    setUserStats(newStats);
    localStorage.setItem('katakanaStats', JSON.stringify(newStats));

    setView('menu'); 
  };

  return (
    <div className="game-container">
      
      {/* --- MENU SCREEN --- */}
      {view === 'menu' && (
        <div className="menu-screen">
          <h1>Katakana Mastery <span className="jp-font">カタカナ</span></h1>
          
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

      {/* --- GAME SCREEN --- */}
      {view === 'game' && (
        <Game 
          dataset={activeGameData} 
          username={username || "Guest"} // ส่งชื่อผู้เล่นไปที่เกม
          category="katakana"
          onEnd={handleEnd} 
          onCancel={() => setView('menu')}
          inputMode={useInputMode} 
        />
      )}

      {/* --- PROFILE SCREEN --- */}
      {view === 'profile' && (
        <Profile 
           history={userStats.history} 
           username={username || "Guest Player"} // ส่งชื่อผู้เล่นไปที่กราฟ
           onBack={() => setView('menu')} 
        />
      )}
    </div>
  );
};

export default KatakanaGame;