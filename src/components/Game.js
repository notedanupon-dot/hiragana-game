import React, { useState, useEffect } from 'react';
import { saveScoreToFirebase } from '../services/scoreService'; 
import '../App.css'; 
import { playAudio } from '../services/audioService'; // ✅ Import มาแล้ว
import { playCorrect, playWrong } from '../services/sfxService'; // 👈 เพิ่มบรรทัดนี้

const QUESTION_LIMIT = 10;
const SHOW_AUDIO_BTN = false; // 👈 เปลี่ยนเป็น true ถ้าอยากให้แสดง, false เพื่อซ่อน

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

  // ✅ (Optional) Effect: ถ้าอยากให้เสียงดัง "อัตโนมัติ" ทันทีที่โจทย์มา ให้เอา Comment ออกครับ
  /*
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
        const textToSpeak = questions[currentIndex].char || questions[currentIndex].character;
        playAudio(textToSpeak);
    }
  }, [currentIndex, questions]);
  */

  const handleAnswer = (romaji) => {
    if (isAnswered) return;

    const currentQ = questions[currentIndex];
    const isCorrect = romaji === currentQ.romaji;

    // ✅ ส่วนที่เพิ่ม: เช็คว่าถูกหรือผิด แล้วสั่งเล่นเสียง
    if (isCorrect) {
        playCorrect(); // 🔊 เสียงปิ๊ง!
    } else {
        playWrong();   // 🔊 เสียงตื๊ด...
    }
    
    setSelectedAnswer(romaji);
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
      } else {
        // 🏁 จบเกม
        if (category) {
            console.log("Saving score:", nextScore, "for", category);
            saveScoreToFirebase(username, nextScore, category);
        } else {
            console.warn("No category provided, score not saved to DB.");
        }

        onEnd({
          score: nextScore, 
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
    <div className="hiragana-char">
      {currentQ.char || currentQ.character || "?"}
    </div>

    {/* ✅ ถ้า SHOW_AUDIO_BTN เป็น true ถึงจะแสดงปุ่ม */}
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