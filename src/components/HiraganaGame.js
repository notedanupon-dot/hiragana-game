import React, { useState, useEffect } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import Game from '../components/Game';
import Profile from '../components/Profile';
import Shop from '../pages/Shop'; 
import { hiraganaData } from '../data/hiragana';
import '../App.css'; 

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
          
          {/* ✅ ย้ายปุ่มร้านค้ามาไว้ด้านบน (Toolbar) */}
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

          {/* ❌ ลบปุ่มร้านค้าด้านล่างออกแล้ว */}
        </div>
      )}

      {/* --- GAME --- */}
      {view === 'game' && (
        <Game 
          dataset={hiraganaData} 
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

export default HiraganaGame;