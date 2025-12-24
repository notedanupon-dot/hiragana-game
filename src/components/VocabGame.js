import React, { useState, useEffect } from 'react';
import { vocabData } from '../data/vocab'; // ตรวจสอบ path ให้ถูกต้อง
import Game from './Game';
import Dashboard from './Dashboard'; // หรือ '../components/Dashboard'
import '../App.css';

function VocabGame({ username }) {
  const [view, setView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} 
  });

  // 🔄 แปลงข้อมูลให้เข้ากับ Game Engine เดิม
  const activeGameData = vocabData.map(item => ({
    character: item.japanese, 
    romaji: item.english,     
    original: item            
  }));

  // โหลดสถิติจากเครื่อง
  useEffect(() => {
    const savedData = localStorage.getItem('vocabUserStats');
    if (savedData) setUserStats(JSON.parse(savedData));
  }, []);

  // บันทึกสถิติลงเครื่อง
  useEffect(() => {
    localStorage.setItem('vocabUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    // 1. อัปเดต History (เฉพาะในเครื่อง Local)
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

    // *หมายเหตุ: การส่งคะแนนไป Firebase ทำใน Game.js แล้ว ไม่ต้องทำตรงนี้ซ้ำ*

    setView('dashboard');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Vocabulary Challenge <span className="jp-font">単語</span></h1>
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
            
            // ✅ จุดสำคัญ: ส่งข้อมูลไปให้ Game.js บันทึกคะแนนลงหมวด vocab
            username={username || "Guest"} 
            category="vocab" 
          />
        )}
      </main>
    </div>
  );
}

export default VocabGame;