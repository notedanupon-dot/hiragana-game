import React, { useState, useEffect } from 'react';
import { hiraganaData } from '../data/hiragana'; // ✅ ตรวจสอบ import ให้ถูกต้อง
import Game from './Game';
import Dashboard from '../components/Dashboard';
import { saveScoreToFirebase } from '../services/scoreService'; // ✅ ระบบ Firebase
import '../App.css';

function HiraganaGame({ username }) {
  const [view, setView] = useState('dashboard'); // สถานะ: 'dashboard' หรือ 'game'
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [], 
    charStats: {} 
  });

  // กรองเอาเฉพาะตัวที่มีข้อมูล (ป้องกันตัวว่างถ้ามี)
  const activeGameData = hiraganaData ? hiraganaData.filter(item => item.character && item.character !== '') : [];

  // 1. โหลดสถิติจากเครื่อง (Local Storage) - ใช้คีย์ 'hiraganaUserStats'
  useEffect(() => {
    const savedData = localStorage.getItem('hiraganaUserStats');
    if (savedData) {
      setUserStats(JSON.parse(savedData));
    }
  }, []);

  // 2. บันทึกสถิติลงเครื่องเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('hiraganaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  // 3. ฟังก์ชันจบเกม
  const handleGameEnd = (sessionData) => {
    // --- Update Local Stats ---
    const newHistory = [...userStats.history, {
      date: new Date().toLocaleDateString(),
      score: sessionData.score,
      total: sessionData.total,
      accuracy: Math.round((sessionData.score / sessionData.total) * 100)
    }];

    const newCharStats = { ...userStats.charStats };
    sessionData.details.forEach(item => {
      if (item.romaji) {
          if (!newCharStats[item.romaji]) newCharStats[item.romaji] = { correct: 0, attempts: 0 };
          newCharStats[item.romaji].attempts += 1;
          if (item.isCorrect) newCharStats[item.romaji].correct += 1;
      }
    });

    // --- ✅ Save to Firebase ---
    if (username) {
      saveScoreToFirebase(username, sessionData.score);
    }

    // --- Update State ---
    setUserStats({
      totalAttempts: userStats.totalAttempts + sessionData.total,
      totalCorrect: userStats.totalCorrect + sessionData.score,
      history: newHistory,
      charStats: newCharStats
    });

    setView('dashboard'); // กลับไปหน้า Dashboard
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hiragana Mastery <span className="jp-font">ひらがな</span></h1>
      </header>
      
      <main>
        {/* เลือกแสดงผลตาม State view */}
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