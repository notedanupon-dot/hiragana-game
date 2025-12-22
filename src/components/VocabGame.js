import React, { useState, useEffect } from 'react';
import { vocabData } from '../data/vocab'; // โหลดคำศัพท์
import Game from './Game';
import Dashboard from '../components/Dashboard';
import { saveScoreToFirebase } from '../services/scoreService';
import '../App.css';

function VocabGame({ username }) {
  const [view, setView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} // เก็บสถิติรายคำ
  });

  // 🔄 แปลงข้อมูลให้เข้ากับ Game Engine เดิม
  // เปลี่ยน 'japanese' -> 'character' (คำถาม)
  // เปลี่ยน 'english' -> 'romaji' (คำตอบ)
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

  // บันทึกสถิติ
  useEffect(() => {
    localStorage.setItem('vocabUserStats', JSON.stringify(userStats));
  }, [userStats]);

  const handleGameEnd = (sessionData) => {
    // อัปเดต History
    const newHistory = [...userStats.history, {
      date: new Date().toLocaleDateString(),
      score: sessionData.score,
      total: sessionData.total,
      accuracy: Math.round((sessionData.score / sessionData.total) * 100)
    }];

    // บันทึก Firebase
    if (username) {
      saveScoreToFirebase(username, sessionData.score);
    }

    setUserStats({
      totalAttempts: userStats.totalAttempts + sessionData.total,
      totalCorrect: userStats.totalCorrect + sessionData.score,
      history: newHistory,
      charStats: userStats.charStats // (ส่วนนี้ละไว้ก่อนสำหรับ vocab)
    });

    setView('dashboard');
  };

  return (
    <div className="app-container">
      <header>
        {/* เปลี่ยนหัวข้อเป็น Vocabulary */}
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
          />
        )}
      </main>
    </div>
  );
}

export default VocabGame;