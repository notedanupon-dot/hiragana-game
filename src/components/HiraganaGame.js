import React, { useState, useEffect } from 'react';
import { hiraganaData } from '../data/hiragana';
import Game from './Game';
import Dashboard from '../components/Dashboard'; // เรียกใช้ไฟล์ที่เราเพิ่งสร้าง
import { saveScoreToFirebase } from '../services/scoreService';
import '../App.css';

function HiraganaGame({ username }) {
  const [view, setView] = useState('dashboard'); // เริ่มต้นที่หน้า Dashboard
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [], 
    charStats: {} 
  });

  // กรองข้อมูลตัวอักษรให้ถูกต้อง
  const activeGameData = hiraganaData ? hiraganaData.filter(item => item.character && item.character !== '') : [];

  // โหลดสถิติจากเครื่อง
  useEffect(() => {
    const savedData = localStorage.getItem('hiraganaUserStats');
    if (savedData) {
      setUserStats(JSON.parse(savedData));
    }
  }, []);

  // บันทึกสถิติลงเครื่อง
  useEffect(() => {
    localStorage.setItem('hiraganaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  // ฟังก์ชันจบเกม
  const handleGameEnd = (sessionData) => {
    // อัปเดตสถิติ
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

    // ส่งคะแนนไป Firebase
    if (username) {
      saveScoreToFirebase(username, sessionData.score);
    }

    // เซฟลง State
    setUserStats({
      totalAttempts: userStats.totalAttempts + sessionData.total,
      totalCorrect: userStats.totalCorrect + sessionData.score,
      history: newHistory,
      charStats: newCharStats
    });

    // กลับไปหน้า Dashboard
    setView('dashboard');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hiragana Mastery <span className="jp-font">ひらがな</span></h1>
      </header>
      
      <main>
        {/* เงื่อนไข: ถ้า view เป็น dashboard ให้โชว์ Dashboard, ถ้าเป็น game ให้โชว์ Game */}
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