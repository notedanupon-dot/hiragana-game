import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vocabData } from '../data/vocab'; // ตรวจสอบว่า path นี้ถูกต้อง
import '../App.css';

const QUESTION_LIMIT = 10; // จำนวนข้อต่อเกม

function VocabGame() {
  // --- States ---
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // --- Init Game (โหลดโจทย์เมื่อเริ่มเกม) ---
  useEffect(() => {
    // 1. สุ่มลำดับข้อมูลทั้งหมด
    const shuffledAll = [...vocabData].sort(() => 0.5 - Math.random());
    // 2. เลือกมาตามจำนวนที่กำหนด
    const selectedQuestions = shuffledAll.slice(0, QUESTION_LIMIT);

    // 3. สร้างตัวเลือกคำตอบ (Options) สำหรับแต่ละข้อ
    const gameQuestions = selectedQuestions.map(question => {
      // สุ่มตัวหลอก 3 ตัว ที่ไม่ใช่คำตอบที่ถูกต้อง
      const distractors = vocabData
        .filter(item => item.meaning !== question.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      // รวมคำตอบถูก + ตัวหลอก แล้วสุ่มลำดับ
      const options = [question, ...distractors].sort(() => 0.5 - Math.random());
      
      return { ...question, options };
    });

    setQuestions(gameQuestions);
  }, []);

  // --- Handlers ---
  const handleAnswerClick = (selectedMeaning) => {
    if (isAnswered) return; // ป้องกันการกดซ้ำ

    const currentQ = questions[currentIndex];
    const isCorrect = selectedMeaning === currentQ.meaning;

    setSelectedAnswer(selectedMeaning);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(score + 1);
    }

    // รอ 1.5 วินาทีแล้วไปข้อถัดไป
    setTimeout(() => {
      if (currentIndex + 1 < QUESTION_LIMIT) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowResult(true); // จบเกม
      }
    }, 1500);
  };

  const resetGame = () => {
    window.location.reload(); // โหลดหน้าใหม่เพื่อนับหนึ่ง
  };

  // --- Render: หน้าโหลด ---
  if (questions.length === 0) {
    return <div className="app-container" style={{textAlign: 'center'}}>กำลังโหลด...</div>;
  }

  // --- Render: หน้าสรุปผล ---
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

  // --- Render: หน้าเล่นเกม (UI ใหม่) ---
  const currentQ = questions[currentIndex];

  return (
    <div className="app-container">
      <header>
        <h1>Vocabulary Mastery <span className="jp-font">語彙</span></h1>
      </header>

      {/* ✅ ใช้ game-card เหมือนเกมอื่นๆ */}
      <div className="game-card">
        
        {/* ✅ Progress Bar */}
        <div className="progress-bar">
          <div 
            className="fill" 
            style={{ width: `${((currentIndex) / QUESTION_LIMIT) * 100}%` }}
          ></div>
        </div>

        {/* ✅ ส่วนแสดงโจทย์ (ใช้ class ใหม่ .vocab-question) */}
        <div className="vocab-question">
          <span className="jp">{currentQ.japanese}</span>
          <span className="romaji">({currentQ.romaji})</span>
        </div>

        {/* ✅ Grid ปุ่มคำตอบ */}
        <div className="options-grid">
          {currentQ.options.map((option, index) => {
            // กำหนด class สำหรับแสดงสี ถูก/ผิด
            let btnClass = "option-btn";
            if (isAnswered) {
              if (option.meaning === currentQ.meaning) {
                btnClass += " correct"; // ปุ่มที่ถูก (สีเขียว)
              } else if (option.meaning === selectedAnswer) {
                btnClass += " wrong"; // ปุ่มที่เลือกผิด (สีแดง)
              }
            }

            return (
              <button
                key={index}
                className={btnClass}
                onClick={() => handleAnswerClick(option.meaning)}
                disabled={isAnswered}
                style={{ fontSize: '1.2rem' }} // ปรับขนาดฟอนต์ให้เหมาะกับภาษาอังกฤษ
              >
                {option.meaning}
              </button>
            );
          })}
        </div>

        {/* ✅ Footer แสดงคะแนนและปุ่มออก */}
        <div className="game-footer">
          <span>Score: {score}</span>
          <Link to="/" className="text-btn">Quit</Link>
        </div>

      </div>
    </div>
  );
}

export default VocabGame;