import React, { useState, useEffect } from 'react';
import { katakanaData } from '../data/katakana';
import Game from '../components/Game';
import Profile from '../components/Profile'; // ✅ 1. นำเข้า Profile
import '../App.css'; 

const KatakanaGame = ({ username }) => {
  // ✅ 2. เปลี่ยน State เป็น view เพื่อคุมการสลับหน้า (menu, game, profile)
  const [view, setView] = useState('menu'); 
  
  // State สำหรับโหมดพิมพ์
  const [useInputMode, setUseInputMode] = useState(false);

  // ✅ 3. State สำหรับเก็บประวัติคะแนนของ Katakana
  const [userStats, setUserStats] = useState({ history: [] });

  // กรองข้อมูล: เอาเฉพาะที่มีตัวอักษร (กัน Error)
  const activeGameData = katakanaData.filter(item => item.character && item.character !== '');

  // ✅ 4. โหลดข้อมูลเก่าจาก LocalStorage (ใช้ key ต่างกับ Hiragana)
  useEffect(() => {
    const savedStats = localStorage.getItem('katakanaStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // ✅ 5. ฟังก์ชันเมื่อจบเกม (บันทึกคะแนนลงเครื่อง)
  const handleEnd = (result) => {
    console.log("Game Ended", result);

    const newHistoryItem = {
      date: new Date().toLocaleDateString('en-GB'), // เก็บวันที่แบบ วัน/เดือน/ปี
      score: result.score
    };

    const newStats = {
      ...userStats,
      history: [...userStats.history, newHistoryItem]
    };

    // บันทึกลง LocalStorage ในชื่อ 'katakanaStats'
    setUserStats(newStats);
    localStorage.setItem('katakanaStats', JSON.stringify(newStats));

    setView('menu'); // กลับไปหน้าเมนู
  };

  return (
    <div className="game-container">
      
      {/* --- กรณีอยู่ที่หน้า MENU --- */}
      {view === 'menu' && (
        <div className="menu-screen">
          <h1>Katakana Mastery <span className="jp-font">カタカナ</span></h1>
          
          {/* ตัวเลือกเปิด/ปิด โหมดพิมพ์ */}
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

          {/* ✅ ปุ่มกดดู Profile */}
          <button 
            className="text-btn" 
            style={{ marginTop: '15px', fontSize: '16px', color: '#555' }}
            onClick={() => setView('profile')}
          >
            📊 ดูสถิติพัฒนาการ
          </button>
        </div>
      )}

      {/* --- กรณีอยู่ที่หน้า GAME --- */}
      {view === 'game' && (
        <Game 
          dataset={activeGameData} 
          username={username || "Guest"} 
          category="katakana"
          onEnd={handleEnd} 
          onCancel={() => setView('menu')}
          inputMode={useInputMode} 
        />
      )}

      {/* --- กรณีอยู่ที่หน้า PROFILE --- */}
      {view === 'profile' && (
        <Profile 
           history={userStats.history} 
           username={username || "Guest Player"} 
           onBack={() => setView('menu')} 
        />
      )}
    </div>
  );
};

export default KatakanaGame;