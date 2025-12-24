import React, { useState, useEffect, useRef } from 'react';
import { saveScoreToFirebase } from '../services/scoreService'; 
import { playAudio } from '../services/audioService'; 
import { playCorrect, playWrong } from '../services/sfxService'; 
import '../App.css'; 

const GAME_DURATION = 60; // ⏱️ ตั้งเวลาเล่นเกมตรงนี้ (วินาที)

const Game = ({ dataset, onEnd, onCancel, username, category, inputMode = false }) => {
  // --- State ---
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION); // State สำหรับเวลา
  const [isGameActive, setIsGameActive] = useState(true);  // State เช็คว่าเกมจบหรือยัง

  const [inputValue, setInputValue] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionDetails, setSessionDetails] = useState([]); 
  const [feedbackStatus, setFeedbackStatus] = useState(null); 
  
  const inputRef = useRef(null);

  // --- 1. เตรียมโจทย์ (Shuffle ครั้งแรก) ---
  useEffect(() => {
    if (!dataset || dataset.length === 0) return;
    prepareQuestions();
  }, [dataset]);

  // ฟังก์ชันสุ่มโจทย์และตัวหลอก
  const prepareQuestions = () => {
    const shuffled = [...dataset].sort(() => 0.5 - Math.random());
    
    const gameQuestions = shuffled.map(q => {
      // สุ่มตัวหลอก 3 ตัว
      const distractors = dataset
        .filter(item => item.romaji !== q.romaji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [q, ...distractors].sort(() => 0.5 - Math.random());
      return { ...q, options };
    });
    setQuestions(gameQuestions);
  };

  // --- 2. ระบบจับเวลา (Timer) ---
  useEffect(() => {
    if (!isGameActive) return;

    // ถ้าเวลาหมด ให้จบเกมทันที
    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameActive]);

  // --- 3. Focus ช่องพิมพ์ (สำหรับ Input Mode) ---
  useEffect(() => {
    if (inputMode && !isAnswered && isGameActive && inputRef.current) {
        inputRef.current.focus();
    }
  }, [currentIndex, isAnswered, inputMode, isGameActive]);


  // --- Logic การตอบ ---
  const handleAnswer = (answer) => {
    if (isAnswered || !isGameActive) return; // ถ้าตอบแล้ว หรือเวลาหมด ห้ามกดซ้ำ

    const currentQ = questions[currentIndex];
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentQ.romaji.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    // Effect เสียงและสี
    if (isCorrect) {
        playCorrect();
        setFeedbackStatus('correct');
    } else {
        playWrong();
        setFeedbackStatus('wrong');
    }

    setTimeout(() => setFeedbackStatus(null), 500);
    
    setSelectedAnswer(userAnswer);
    setIsAnswered(true);

    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);

    const newDetails = [...sessionDetails, { 
      romaji: currentQ.romaji, 
      isCorrect 
    }];
    setSessionDetails(newDetails);

    // --- Logic เปลี่ยนข้อ ---
    // ลดเวลา Delay ลงหน่อยเพื่อให้เกมไหลลื่น (ถูก=เร็ว / ผิด=ช้าหน่อยเพื่อให้ดูเฉลย)
    const delayTime = isCorrect ? 400 : 1500; 

    setTimeout(() => {
      if (!isGameActive) return; // ถ้าเวลาระหว่างรอ Time หมดพอดี ไม่ต้องทำต่อ

      // ถ้าข้อหมดแล้ว (ครบ Loop) ให้วน Loop ใหม่ (Infinite Loop)
      if (currentIndex + 1 >= questions.length) {
        prepareQuestions(); // สับไพ่ใหม่
        setCurrentIndex(0);
      } else {
        setCurrentIndex(prev => prev + 1);
      }

      setIsAnswered(false);
      setSelectedAnswer(null);
      setInputValue(""); 
    }, delayTime);
  };

  // ฟังก์ชันจบเกม (Time's Up)
  const endGame = () => {
    setIsGameActive(false); // หยุดทุกอย่าง
    
    if (category) {
        saveScoreToFirebase(username, score, category);
    }

    onEnd({
        score: score, 
        total: sessionDetails.length, // จำนวนข้อที่ทำไปทั้งหมด
        details: sessionDetails
    });
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return; 
    handleAnswer(inputValue);
  };

  if (questions.length === 0) return <div className="loading-text">กำลังโหลดโจทย์...</div>;

  const currentQ = questions[currentIndex];

  // คำนวณ % เวลาสำหรับ Progress Bar
  const timePercentage = (timeLeft / GAME_DURATION) * 100;
  // เปลี่ยนสีหลอดเวลา: เหลือเยอะ=เขียว, น้อย=แดง
  const timerColor = timeLeft > 10 ? '#4CAF50' : '#F44336'; 

  return (
    <div className={`game-card ${feedbackStatus === 'correct' ? 'flash-correct' : feedbackStatus === 'wrong' ? 'flash-wrong' : ''}`}>
      
      {/* --- ส่วนแสดงเวลา (Timer Bar) --- */}
      <div className="timer-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: 'bold' }}>
           <span>⏳ Time: {timeLeft}s</span>
           <span>Score: {score}</span>
        </div>
        <div className="progress-bar" style={{ backgroundColor: '#e0e0e0' }}>
          <div 
            className="fill" 
            style={{ 
                width: `${timePercentage}%`, 
                backgroundColor: timerColor,
                transition: 'width 1s linear, background-color 0.5s' 
            }}
          ></div>
        </div>
      </div>

      <div className="question-area">
        <div className="hiragana-char">
          {currentQ.char || currentQ.character || "?"}
        </div>

        <button 
            className="audio-btn" 
            onClick={() => playAudio(currentQ.char || currentQ.character)}
            title="ฟังเสียงอ่าน"
        >
            🔊
        </button>
      </div>

      {inputMode ? (
        <div className="input-mode-area">
            <form onSubmit={handleInputSubmit} className="input-form">
                <input
                    ref={inputRef}
                    type="text"
                    className="answer-input"
                    placeholder="พิมพ์คำอ่าน..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isAnswered || !isGameActive} 
                    autoComplete="off"
                />
                {!isAnswered && <button type="submit" className="submit-btn" disabled={!isGameActive}>ตอบ</button>}
            </form>

            {isAnswered && selectedAnswer !== currentQ.romaji && (
                <div className="correct-answer-text">
                    เฉลย: {currentQ.romaji}
                </div>
            )}
        </div>
      ) : (
        <div className="options-grid">
            {currentQ.options.map((opt, idx) => {
            let btnClass = "option-btn";
            if (isAnswered) {
                if (opt.romaji === currentQ.romaji) btnClass += " correct";
                else if (opt.romaji === selectedAnswer) btnClass += " wrong";
            }

            return (
                <button
                key={idx}
                className={btnClass}
                onClick={() => handleAnswer(opt.romaji)}
                disabled={isAnswered || !isGameActive}
                >
                {opt.romaji}
                </button>
            );
            })}
        </div>
      )}

      <div className="game-footer">
        <button className="text-btn" onClick={onCancel}>Quit Game</button>
      </div>
    </div>
  );
};

export default Game;