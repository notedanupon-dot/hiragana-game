import React, { useState, useEffect } from 'react';
import { hiraganaData } from '../data/hiragana';
import Game from './Game';
import Dashboard from '../components/Dashboard';
import '../App.css';

// ✅ 1. Import ฟังก์ชันบันทึกคะแนน
import { saveScoreToFirebase } from '../services/scoreService';

// ✅ 2. รับ username เป็น Props จาก App.js
function HiraganaGame({ username }) {
  const [view, setView] = useState('dashboard'); // dashboard, game, result
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [], 
    charStats: {} 
  });

  // กรองเอาเฉพาะตัวที่มีข้อมูล (ตัดช่องว่างทิ้ง)
  const activeGameData = hiraganaData.filter(item => item.character && item.character !== '');

  // Load data from LocalStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('hiraganaUserStats');
    if (savedData) {
      setUserStats(JSON.parse(savedData));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('hiraganaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    // 1. Update History (Local)
    const newHistory = [...userStats.history, {
      date: new Date().toLocaleDateString(),
      score: sessionData.score,
      total: sessionData.total,
      accuracy: Math.round((sessionData.score / sessionData.total) * 100)
    }];

    // 2. Update Character Stats (Local)
    const newCharStats = { ...userStats.charStats };
    sessionData.details.forEach(item => {
      if (item.romaji) {
          if (!newCharStats[item.romaji]) newCharStats[item.romaji] = { correct: 0, attempts: 0 };
          newCharStats[item.romaji].attempts += 1;
          if (item.isCorrect) newCharStats[item.romaji].correct += 1;
      }
    });

    // ✅ 3. บันทึกคะแนนลง Firebase (Global Ranking)
    // เช็คว่ามี username ไหม (กันเหนียว) แล้วส่งคะแนนรอบนี้ไปบวกเพิ่ม
    if (username) {
      saveScoreToFirebase(username, sessionData.score);
    }

    // อัปเดต State ของเครื่องตัวเอง
    setUserStats({
      totalAttempts: userStats.totalAttempts + sessionData.total,
      totalCorrect: userStats.totalCorrect + sessionData.score,
      history: newHistory,
      charStats: newCharStats
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
          <Game dataset={activeGameData} onEnd={handleGameEnd} onCancel={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}

export default HiraganaGame;