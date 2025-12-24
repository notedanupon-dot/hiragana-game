import React, { useState, useEffect, useRef } from 'react';
import { saveScoreToFirebase } from '../services/scoreService'; 
import { playAudio } from '../services/audioService'; 
import { playCorrect, playWrong } from '../services/sfxService'; 
import '../App.css'; 

const QUESTION_LIMIT = 10;
const SHOW_AUDIO_BTN = true; // เปิดปุ่มเสียงไว้

// ✅ เพิ่ม prop: inputMode (รับค่า true/false)
const Game = ({ dataset, onEnd, onCancel, username, category, inputMode = false }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // State สำหรับ Input Mode
  const [inputValue, setInputValue] = useState("");
  
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionDetails, setSessionDetails] = useState([]); 
  const [feedbackStatus, setFeedbackStatus] = useState(null); 
  
  // ใช้ Ref เพื่อ Auto Focus ช่องพิมพ์
  const inputRef = useRef(null);

  // Initialize Game
  useEffect(() => {
    if (!dataset || dataset.length === 0) return;

    const shuffled = [...dataset].sort(() => 0.5 - Math.random()).slice(0, QUESTION_LIMIT);
    
    // ถ้าเป็น Input Mode ไม่ต้องสุ่มตัวหลอก (Distractors) ก็ได้ แต่ทำเผื่อไว้ไม่เสียหาย
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

  // Focus ช่องพิมพ์ทุกครั้งที่เปลี่ยนข้อ (เฉพาะ Input Mode)
  useEffect(() => {
    if (inputMode && !isAnswered && inputRef.current) {
        inputRef.current.focus();
    }
  }, [currentIndex, isAnswered, inputMode]);

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    
    // ✅ Logic ตรวจคำตอบ (Trim ช่องว่าง และแปลงเป็นตัวเล็กทั้งหมด เพื่อกัน Case Sensitive)
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentQ.romaji.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    // Visual Effect & Sound
    if (isCorrect) {
        playCorrect();
        setFeedbackStatus('correct');
    } else {
        playWrong();
        setFeedbackStatus('wrong');
    }

    setTimeout(() => setFeedbackStatus(null), 600);
    
    setSelectedAnswer(userAnswer); // เก็บคำตอบที่ผู้ใช้ตอบมา
    setIsAnswered(true);

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
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setInputValue(""); // ✅ เคลียร์ช่องพิมพ์
      } else {
        // 🏁 จบเกม
        if (category) {
            saveScoreToFirebase(username, nextScore, category);
        }

        onEnd({
          score: nextScore, 
          total: QUESTION_LIMIT,
          details: newDetails
        });
      }
    }, 2000); // ⏳ เพิ่มเวลาดูเฉลยหน่อยครับ (จาก 1.2วิ เป็น 2วิ) กรณีพิมพ์ผิดจะได้ดูทัน
  };

  // ✅ ฟังก์ชันกด Enter เพื่อส่งคำตอบ
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return; // ห้ามส่งคำตอบว่าง
    handleAnswer(inputValue);
  };

  if (questions.length === 0) return <div className="loading-text">กำลังโหลดโจทย์...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className={`game-card ${feedbackStatus === 'correct' ? 'flash-correct' : feedbackStatus === 'wrong' ? 'flash-wrong' : ''}`}>
      <div className="progress-bar">
        <div 
          className="fill" 
          style={{ width: `${((currentIndex) / QUESTION_LIMIT) * 100}%` }}
        ></div>
      </div>

      <div className="question-area">
        <div className="hiragana-char">
          {currentQ.char || currentQ.character || "?"}
        </div>

        {SHOW_AUDIO_BTN && (
          <button 
              className="audio-btn" 
              onClick={() => playAudio(currentQ.char || currentQ.character)}
              title="ฟังเสียงอ่าน"
          >
              🔊
          </button>
        )}
      </div>

      {/* ✅ เงื่อนไขการแสดงผล: ถ้า inputMode = true ให้โชว์ช่องพิมพ์ */}
      {inputMode ? (
        <div className="input-mode-area">
            <form onSubmit={handleInputSubmit} className="input-form">
                <input
                    ref={inputRef}
                    type="text"
                    className="answer-input"
                    placeholder="พิมพ์คำอ่าน (Romaji)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isAnswered} // ล็อคช่องหลังตอบแล้ว
                    autoComplete="off"
                />
                {!isAnswered && <button type="submit" className="submit-btn">ตอบ</button>}
            </form>

            {/* ส่วนแสดงเฉลย (โชว์เมื่อตอบผิดเท่านั้น) */}
            {isAnswered && selectedAnswer !== currentQ.romaji && (
                <div className="correct-answer-text">
                    เฉลย: {currentQ.romaji}
                </div>
            )}
        </div>
      ) : (
        /* ✅ ถ้า inputMode = false ให้โชว์ปุ่มตัวเลือกแบบเดิม */
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
      )}

      <div className="game-footer">
        <span>Score: {score}</span>
        <button className="text-btn" onClick={onCancel}>Quit</button>
      </div>
    </div>
  );
};

export default Game;