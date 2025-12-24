import React, { useState, useEffect } from 'react';
import { saveScoreToFirebase } from '../services/scoreService'; // ✅ Import มาแล้วต้องเรียกใช้
import '../App.css'; // อย่าลืม CSS

const QUESTION_LIMIT = 10;

// ✅ รับ props: username และ category เพิ่มเข้ามา
const Game = ({ dataset, onEnd, onCancel, username, category }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionDetails, setSessionDetails] = useState([]); 

  // Initialize Game
  useEffect(() => {
    if (!dataset || dataset.length === 0) return;

    // Shuffle dataset and pick 10
    const shuffled = [...dataset].sort(() => 0.5 - Math.random()).slice(0, QUESTION_LIMIT);
    
    const gameQuestions = shuffled.map(q => {
      const distractors = dataset
        .filter(item => item.romaji !== q.romaji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [q, ...distractors].sort(() => 0.5 - Math.random());
      return { ...q, options };
    });

    setQuestions(gameQuestions);
  }, [dataset]);

  const handleAnswer = (romaji) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    const isCorrect = romaji === currentQ.romaji;
    
    setSelectedAnswer(romaji);
    setIsAnswered(true);

    // คำนวณคะแนนปัจจุบันเตรียมไว้เลย (เผื่อใช้ทันที)
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);

    const newDetails = [...sessionDetails, { 
      romaji: currentQ.romaji, 
      isCorrect 
    }];
    setSessionDetails(newDetails);

    // Delay ก่อนไปข้อถัดไป
    setTimeout(() => {
      if (currentIndex + 1 < QUESTION_LIMIT) {
        // ยังไม่จบเกม -> ไปข้อต่อไป
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        // 🏁 จบเกม (Game Over)
        
        // 1. บันทึกคะแนนลง Firebase ทันที!
        if (category) {
            console.log("Saving score:", nextScore, "for", category);
            saveScoreToFirebase(username, nextScore, category);
        } else {
            console.warn("No category provided, score not saved to DB.");
        }

        // 2. ส่งข้อมูลกลับไปที่ Parent Component
        onEnd({
          score: nextScore, // ✅ ใช้ nextScore เพื่อความชัวร์ว่ารวมข้อสุดท้ายแล้ว
          total: QUESTION_LIMIT,
          details: newDetails
        });
      }
    }, 1200); 
  };

  if (questions.length === 0) return <div className="loading-text">กำลังโหลดโจทย์...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="game-card">
      <div className="progress-bar">
        <div 
          className="fill" 
          style={{ width: `${((currentIndex) / QUESTION_LIMIT) * 100}%` }}
        ></div>
      </div>

      <div className="question-area">
        {/* แสดงผลรองรับทั้งคีย์ char และ character */}
        <div className="hiragana-char">
          {currentQ.char || currentQ.character || "?"}
        </div>
      </div>

      <div className="options-grid">
        {currentQ.options.map((opt) => {
          let btnClass = "option-btn";
          if (isAnswered) {
             if (opt.romaji === currentQ.romaji) btnClass += " correct";
             else if (opt.romaji === selectedAnswer) btnClass += " wrong";
          }

          return (
            <button
              key={opt.romaji}
              className={btnClass}
              onClick={() => handleAnswer(opt.romaji)}
              disabled={isAnswered}
            >
              {opt.romaji}
            </button>
          );
        })}
      </div>

      <div className="game-footer">
        <span>Score: {score}</span>
        <button className="text-btn" onClick={onCancel}>Quit</button>
      </div>
    </div>
  );
};

export default Game;