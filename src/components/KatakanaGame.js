import React, { useState, useEffect } from 'react';
import { katakanaData } from '../data/katakana'; 
import Game from './Game';
import Dashboard from './Dashboard'; 
import '../App.css';

function KatakanaGame({ username }) {
  const [view, setView] = useState('dashboard');
  
  // ✅ 1. เพิ่ม State สำหรับเก็บค่าว่าผู้เล่นเลือกโหมดพิมพ์หรือไม่ (Default = false)
  const [useInputMode, setUseInputMode] = useState(false);

  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} 
  });

  const activeGameData = katakanaData.filter(item => item.character !== '');

  useEffect(() => {
    const savedData = localStorage.getItem('katakanaUserStats');
    if (savedData) setUserStats(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('katakanaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    const newHistory = [...userStats.history, {
      date: new Date().toLocaleDateString(),
      score: sessionData.score,
      total: sessionData.total,
      accuracy: Math.round((sessionData.score / sessionData.total) * 100)
    }];

    setUserStats({
      totalAttempts: userStats.totalAttempts + sessionData.total,
      totalCorrect: userStats.totalCorrect + sessionData.score,
      history: newHistory,
      charStats: userStats.charStats
    });

    setView('dashboard');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Katakana Mastery <span className="jp-font">カタカナ</span></h1>
      </header>
      
      <main>
        {view === 'dashboard' && (
          <div className="dashboard-wrapper">
            
            {/* ✅ 2. เพิ่มส่วนตัวเลือกโหมด (วางไว้เหนือ Dashboard) */}
            <div className="mode-selector-container" style={{ textAlign: 'center', margin: '20px 0' }}>
               <label className="mode-toggle-label">
                 <input 
                   type="checkbox" 
                   checked={useInputMode} 
                   onChange={(e) => setUseInputMode(e.target.checked)}
                   className="mode-checkbox"
                 />
                 <span className="mode-text">เปิดโหมดพิมพ์ตอบ (ยาก) ⌨️</span>
               </label>
            </div>

            <Dashboard stats={userStats} onStart={() => setView('game')} />
          </div>
        )}
        
        {view === 'game' && (
          <Game 
            dataset={activeGameData} 
            onEnd={handleGameEnd} 
            onCancel={() => setView('dashboard')}
            username={username || "Guest"} 
            category="katakana" 

            // ✅ 3. ส่งค่าที่ผู้เล่นเลือกไปยัง Game Component
            inputMode={useInputMode}
          />
        )}
      </main>
    </div>
  );
}

export default KatakanaGame;