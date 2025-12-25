import React, { useState, useEffect } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import { katakanaData } from '../data/katakana';
import Game from '../components/Game';
import Profile from '../components/Profile';
import Shop from '../pages/Shop'; 
import '../App.css'; 
// ✅ Import ไฟล์เกมเติมคำ
import KatakanaFillGame from './KatakanaFillGame';

const KatakanaGame = ({ username }) => {
  const [view, setView] = useState('menu'); 
  const [useInputMode, setUseInputMode] = useState(false);
  const [userStats, setUserStats] = useState({ history: [] });

  const activeGameData = katakanaData.filter(item => item.character && item.character !== '');

  useEffect(() => {
    const savedStats = localStorage.getItem('katakanaStats');
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
    localStorage.setItem('katakanaStats', JSON.stringify(newStats));

    if (username && username !== "Guest") {
      const db = getDatabase();
      const userRef = ref(db, `users/${username}/coins`);
      
      runTransaction(userRef, (currentCoins) => {
        return (currentCoins || 0) + result.score; 
      });
    }

    setView('menu'); 
  };

  return (
    <div className="game-container">
      
      {/* --- MENU SCREEN --- */}
      {view === 'menu' && (
        <div className="menu-screen" style={{ position: 'relative' }}>
          
          {/* ✅ ปุ่มร้านค้าด้านบน */}
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
          
          {/* ✅ เพิ่มปุ่มเข้าโหมดเติมตาราง (Katakana Fill Chart) */}
          <button 
            className="start-btn" 
            style={{ marginTop: '15px', background: '#FF5722' }} // สีส้มเข้ม
            onClick={() => setView('fillchart')}
          >
            🧩 เติมตารางคาตาคานะ
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
          username={username || "Guest"} 
          category="katakana"
          onEnd={handleEnd} 
          onCancel={() => setView('menu')}
          inputMode={useInputMode} 
        />
      )}

      {/* --- ✅ เพิ่มส่วนแสดงผล Katakana Fill Chart --- */}
      {view === 'fillchart' && (
        <KatakanaFillGame 
          username={username || "Guest"} 
          onBack={() => setView('menu')} 
        />
      )}

      {/* --- PROFILE SCREEN --- */}
      {view === 'profile' && (
        <Profile 
           history={userStats.history} 
           username={username || "Guest Player"}
           onBack={() => setView('menu')} 
        />
      )}

      {/* --- SHOP SCREEN --- */}
      {view === 'shop' && (
        <Shop 
          username={username || "Guest"} 
          onBack={() => setView('menu')} 
        />
      )}
    </div>
  );
};

export default KatakanaGame;