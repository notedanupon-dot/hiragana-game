import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vocabData } from '../data/vocab';
import '../App.css';

// ✅ 1. Import ฟังก์ชันสำหรับบันทึกคะแนน
import { saveScoreToFirebase } from '../services/scoreService';

const QUESTION_LIMIT = 10;

// ✅ 2. รับ username เข้ามาเพื่อใช้บันทึกคะแนน
function VocabGame({ username }) {
  // --- States ---
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // --- Init Game ---
  useEffect(() => {
    const shuffledAll = [...vocabData].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledAll.slice(0, QUESTION_LIMIT);

    const gameQuestions = selectedQuestions.map(question => {
      const distractors = vocabData
        .filter(item => item.meaning !== question.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [question, ...distractors].sort(() => 0.5 - Math.random());
      
      return { ...question, options };
    });

    setQuestions(gameQuestions);
  }, []);

  // --- Handlers ---
  const handleAnswerClick = (selectedMeaning) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedMeaning === currentQ.meaning;

    // คำนวณคะแนนใหม่ทันที (เพราะ state score จะอัปเดตในรอบถัดไป)
    const newScore = isCorrect ? score + 1 : score;

    setSelectedAnswer(selectedMeaning);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(newScore);
    }

    // รอ 1.5 วินาที
    setTimeout(() => {
      if (currentIndex + 1 < QUESTION_LIMIT) {
        // ไปข้อถัดไป
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        // --- จบเกม ---
        
        // ✅ 3. ส่งคะแนนไปบันทึกที่ Firebase
        if (username) {
          saveScoreToFirebase(username, newScore);
        }

        setShowResult(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    window.location.reload();
  };

  // --- Render: Loading ---
  if (questions.length === 0) {
    return <div className="app-container" style={{textAlign: 'center'}}>กำลังโหลด...</div>;
  }

  // --- Render: Result ---
  if (showResult) {
    return (
      <div className="app-container">
        <div className="game-card">
          <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>🎉 จบเกม! 🎉</h2>
          <p style={{fontSize: '1.5rem', color: 'var(--text-light)'}}>
            คุณทำได้: <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{score}</span> / {QUESTION_LIMIT} คะแนน
          </p>
          <div style={{marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <button onClick={resetGame} className="start-btn">
              เล่นอีกครั้ง
            </button>
            <Link to="/" className="btn-outline" style={{textAlign: 'center', textDecoration: 'none'}}>
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Game UI ---
  const currentQ = questions[currentIndex];

  return (
    <div className="app-container">
      <header>
        <h1>Vocabulary Mastery <span className="jp-font">語彙</span></h1>
      </header>

      <div className="game-card">
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="fill" 
            style={{ width: `${((currentIndex) / QUESTION_LIMIT) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="vocab-question">
          <span className="jp">{currentQ.japanese}</span>
          <span className="romaji">({currentQ.romaji})</span>
        </div>

        {/* Options Grid */}
        <div className="options-grid">
          {currentQ.options.map((option, index) => {
            let btnClass = "option-btn";
            if (isAnswered) {
              if (option.meaning === currentQ.meaning) {
                btnClass += " correct";
              } else if (option.meaning === selectedAnswer) {
                btnClass += " wrong";
              }
            }

            return (
              <button
                key={index}
                className={btnClass}
                onClick={() => handleAnswerClick(option.meaning)}
                disabled={isAnswered}
                style={{ fontSize: '1.2rem' }}
              >
                {option.meaning}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="game-footer">
          <span>Score: {score}</span>
          <Link to="/" className="text-btn">Quit</Link>
        </div>

      </div>
    </div>
  );
}

export default VocabGame;