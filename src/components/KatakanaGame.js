import React, { useState, useEffect } from 'react';
import { katakanaData } from '../data/katakana'; // ตรวจสอบ path ให้ถูกต้อง
import Game from './Game';
import Dashboard from './Dashboard'; // หรือ '../components/Dashboard' ตามโครงสร้างโฟลเดอร์จริงของคุณ
import '../App.css';

function KatakanaGame({ username }) {
  const [view, setView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} 
  });

  // กรองข้อมูล: เอาเฉพาะที่มีตัวอักษร
  const activeGameData = katakanaData.filter(item => item.character !== '');

  // โหลดสถิติจาก LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('katakanaUserStats');
    if (savedData) setUserStats(JSON.parse(savedData));
  }, []);

  // บันทึกสถิติลง LocalStorage
  useEffect(() => {
    localStorage.setItem('katakanaUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    // 1. อัปเดตสถิติ Local (ในเครื่อง)
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

    // *หมายเหตุ: การ saveScoreToFirebase ถูกทำในไฟล์ Game.js แล้ว จึงไม่ต้องทำตรงนี้อีก*

    setView('dashboard');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Katakana Mastery <span className="jp-font">カタカナ</span></h1>
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
            
            // ✅ จุดสำคัญ: ส่งข้อมูลไปให้ Game.js เพื่อบันทึกคะแนน
            username={username || "Guest"} 
            category="katakana" 
          />
        )}
      </main>
    </div>
  );
}

export default KatakanaGame;