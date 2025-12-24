import React, { useState, useEffect } from 'react';
import { hiraganaData } from '../data/hiragana'; // หรือ path ที่ถูกต้องของคุณ
import Game from './Game'; // ✅ เรียกใช้ Game ที่เราเพิ่งแก้
import Dashboard from './Dashboard';
import '../App.css';

// ⚠️ สำคัญ: ต้องรับ prop { username } มาจาก App.js
function HiraganaGame({ username }) {
  const [view, setView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} 
  });

  const activeGameData = hiraganaData.filter(item => item.character !== '');

  // โหลดสถิติจาก LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('hiraganaUserStats');
    if (savedData) setUserStats(JSON.parse(savedData));
  }, []);

  // บันทึกสถิติลง LocalStorage
  useEffect(() => {
    localStorage.setItem('hiraganaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    // อัปเดตสถิติในเครื่อง (ส่วน Firebase ทำใน Game.js ไปแล้ว)
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
        <h1>Hiragana Mastery <span className="jp-font">ひらがな</span></h1>
      </header>
      
      <main>
        {view === 'dashboard' && (
          <Dashboard stats={userStats} onStart={() => setView('game')} />
        )}
        
        {view === 'game' && (
          <Game 
            dataset={activeGameData} 
            onEnd={handleGameEnd} 
            onCancel={() => setView('dashboard')}
            
            // ⭐⭐⭐ จุดสำคัญที่มักลืมใส่ ⭐⭐⭐
            username={username || "Guest"} 
            category="hiragana"  // 👈 ต้องระบุตรงนี้ ไม่งั้น Game จะ error
          />
        )}
      </main>
    </div>
  );
}

export default HiraganaGame;