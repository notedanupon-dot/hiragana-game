import React, { useState, useEffect } from 'react';
import { hiraganaData } from './data/hiragana';
import Game from './components/Game';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, game, result
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    totalCorrect: 0,
    history: [], // Stores past game sessions
    charStats: {} // Stores per-character accuracy { 'a': { correct: 5, attempts: 6 } }
  });

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
    // 1. Update History
    const newHistory = [...userStats.history, {
      date: new Date().toLocaleDateString(),
      score: sessionData.score,
      total: sessionData.total,
      accuracy: Math.round((sessionData.score / sessionData.total) * 100)
    }];

    // 2. Update Character Stats
    const newCharStats = { ...userStats.charStats };
    sessionData.details.forEach(item => {
      if (!newCharStats[item.romaji]) newCharStats[item.romaji] = { correct: 0, attempts: 0 };
      newCharStats[item.romaji].attempts += 1;
      if (item.isCorrect) newCharStats[item.romaji].correct += 1;
    });

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
          <Game dataset={hiraganaData} onEnd={handleGameEnd} onCancel={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}

export default App;