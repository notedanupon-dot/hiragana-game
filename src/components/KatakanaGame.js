import React, { useState, useEffect } from 'react';
import { katakanaData } from '../data/katakana'; // ดึงข้อมูลคาตาคานะ
import Game from './Game';
import Dashboard from '../components/Dashboard';
import { saveScoreToFirebase } from '../services/scoreService';
import '../App.css';

function KatakanaGame({ username }) {
  const [view, setView] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [],
    charStats: {} 
  });

  // ✅ กรองข้อมูล: เอาเฉพาะที่มีตัวอักษร (ตัดช่องว่างในตารางออก)
  const activeGameData = katakanaData.filter(item => item.character !== '');

  // โหลดสถิติ
  useEffect(() => {
    const savedData = localStorage.getItem('katakanaUserStats');
    if (savedData) setUserStats(JSON.parse(savedData));
  }, []);

  // บันทึกสถิติ
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

    if (username) {
      saveScoreToFirebase(username, sessionData.score);
    }

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

export default KatakanaGame;