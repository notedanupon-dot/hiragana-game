import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vocabData from '../data/vocab';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../App.css';

function VocabGame() {
  const [gameState, setGameState] = useState('dashboard');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 10;

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('vocabStats');
    return saved ? JSON.parse(saved) : { history: [], wrongWords: {} };
  });

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * vocabData.length);
    const correct = vocabData[randomIndex];
    let answers = [correct];
    while (answers.length < 4) {
      const random = vocabData[Math.floor(Math.random() * vocabData.length)];
      if (!answers.find(a => a.meaning === random.meaning)) answers.push(random);
    }
    answers.sort(() => Math.random() - 0.5);
    setCurrentQuestion(correct);
    setOptions(answers);
  };

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameState('playing');
    generateQuestion();
  };

  const handleAnswer = (selectedMeaning) => {
    const isCorrect = selectedMeaning === currentQuestion.meaning;
    if (isCorrect) setScore(score + 1);

    if (!isCorrect) {
      const newWrong = { ...stats.wrongWords };
      // ใช้คำภาษาญี่ปุ่นเป็น key ในกราฟ
      const wordKey = currentQuestion.word.split(' ')[0]; 
      newWrong[wordKey] = (newWrong[wordKey] || 0) + 1;
      setStats(prev => ({ ...prev, wrongWords: newWrong }));
    }

    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);

    if (nextCount < totalQuestions) {
      generateQuestion();
    } else {
      finishGame(score + (isCorrect ? 1 : 0));
    }
  };

  const finishGame = (finalScore) => {
    const accuracy = Math.round((finalScore / totalQuestions) * 100);
    const newHistory = [...stats.history, { date: new Date().toLocaleTimeString(), accuracy }];
    if (newHistory.length > 10) newHistory.shift();

    const newStats = { ...stats, history: newHistory };
    setStats(newStats);
    localStorage.setItem('vocabStats', JSON.stringify(newStats));
    setGameState('dashboard');
  };

  const weakSpotsData = Object.keys(stats.wrongWords)
    .map(key => ({ name: key, count: stats.wrongWords[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const globalAccuracy = stats.history.length > 0 
    ? Math.round(stats.history.reduce((a, b) => a + b.accuracy, 0) / stats.history.length) 
    : 0;

  if (gameState === 'dashboard') {
    return (
      <div className="App">
        <header className="App-header" style={{background: '#f4f7f6', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{position: 'absolute', top: 20, left: 20}}>
             <Link to="/" style={{color: '#4a90e2', textDecoration: 'none', fontWeight:'bold'}}>⬅ Back</Link>
          </div>

          <div className="dashboard-container">
            <h1 className="dashboard-title">Vocab Mastery <span style={{color:'#f1c40f'}}>単語</span></h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Quizzes</div>
                <div className="stat-value">{stats.history.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Global Accuracy</div>
                <div className="stat-value">{globalAccuracy}%</div>
              </div>
            </div>

            <button className="start-btn" onClick={startGame} style={{backgroundColor: '#f1c40f'}}>Start New Quiz</button>

            <br/><br/>

            <div className="chart-section">
              <div className="chart-title">Progress History</div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={stats.history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#f1c40f" strokeWidth={2} dot={{r:4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {weakSpotsData.length > 0 && (
              <div className="chart-section">
                <div className="chart-title">Focus Areas (Hard Words)</div>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart layout="vertical" data={weakSpotsData}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#e74c3c" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{marginBottom: '20px'}}>ข้อที่ {questionCount + 1} / {totalQuestions}</div>
        <div className="character-display" style={{fontSize: '3rem'}}>{currentQuestion?.word}</div>
        <div className="options-grid">
          {options.map((opt, i) => (
            <button key={i} className="option-button" onClick={() => handleAnswer(opt.meaning)}>
              {opt.meaning}
            </button>
          ))}
        </div>
      </header>
    </div>
  );
}

export default VocabGame;