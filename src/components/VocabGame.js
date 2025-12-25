import React, { useState, useEffect } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import Game from '../components/Game';
import Profile from '../components/Profile';
import Shop from '../pages/Shop'; 
// ⚠️ ตรวจสอบ path นี้ว่าชื่อไฟล์ data ของคุณคือ vocab.js หรือไม่
import { vocabData } from '../data/vocab'; 
import '../App.css'; 

const VocabGame = ({ username }) => {
  const [view, setView] = useState('menu'); 
  const [useInputMode, setUseInputMode] = useState(false); 
  const [userStats, setUserStats] = useState({ history: [] });

  useEffect(() => {
    const savedStats = localStorage.getItem('vocabStats'); // แยก key เป็น vocabStats
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const handleEnd = (result) => {
    console.log("Vocab Game Ended", result);

    const newHistoryItem = {
      date: new Date().toLocaleDateString('en-GB'),
      score: result.score
    };

    const newStats = {
      ...userStats,
      history: [...userStats.history, newHistoryItem]
    };

    setUserStats(newStats);
    localStorage.setItem('vocabStats', JSON.stringify(newStats));

    // --- ระบบแจกเงิน (Coins) ---
    if (username && username !== "Guest") {
      const db = getDatabase();
      const userRef = ref(db, `users/${username}/coins`);
      
      runTransaction(userRef, (currentCoins) => {
        return (currentCoins || 0) + result.score; 
      }).then(() => {
        console.log(`Added ${result.score} coins to ${username}`);
      }).catch((err) => {
        console.error("Coin update failed", err);
      });
    }

    setView('menu'); 
  };

  return (
    <div className="game-container">
      
      {/* --- MENU --- */}
      {view === 'menu' && (
        <div className="menu-screen">
          
          {/* ✅ ย้ายปุ่มร้านค้ามาไว้ด้านบน (Toolbar) ให้เหมือน Hiragana/Katakana */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button 
              className="shop-btn-top"
              style={{ 
                background: '#FFD700', 
                color: '#333',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }} 
              onClick={() => setView('shop')}
            >
              🛒 ร้านค้า & แต่งตัว
            </button>
          </div>

          <h1>Vocabulary Practice</h1>
          <p>ฝึกจำคำศัพท์ภาษาญี่ปุ่น</p>
          
          {/* Vocab อาจจะไม่ต้องมี Input Mode ก็ได้ หรือถ้ามีก็เก็บไว้ */}
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
          dataset={vocabData} 
          username={username || "Guest"} 
          category="vocab" // สำคัญ: ส่ง category เป็น vocab เพื่อให้ Leaderboard แยกหมวดถูก
          onEnd={handleEnd} 
          onCancel={() => setView('menu')}
          inputMode={useInputMode} 
        />
      )}

      {/* --- PROFILE --- */}
      {view === 'profile' && (
        <Profile 
           history={userStats.history} 
           username={username || "Guest Player"} 
           onBack={() => setView('menu')} 
        />
      )}

      {/* --- SHOP --- */}
      {view === 'shop' && (
        <Shop 
          username={username || "Guest"} 
          onBack={() => setView('menu')} 
        />
      )}

    </div>
  );
};

export default VocabGame;