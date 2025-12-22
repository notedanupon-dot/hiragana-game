import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import katakanaData from '../data/katakana'; // เรียกใช้ข้อมูลคาตาคานะ
import '../App.css'; // ใช้ CSS ตัวเดิมเพื่อให้สวยเหมือนกัน

function KatakanaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState('');

  // ฟังก์ชันสุ่มคำถาม (เหมือนฮิรางานะเป๊ะ)
  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * katakanaData.length);
    const correct = katakanaData[randomIndex];
    
    // สุ่มตัวหลอก 3 ตัว
    let answers = [correct];
    while (answers.length < 4) {
      const randomDistractor = katakanaData[Math.floor(Math.random() * katakanaData.length)];
      if (!answers.find(a => a.character === randomDistractor.character)) {
        answers.push(randomDistractor);
      }
    }
    
    // สลับตำแหน่งคำตอบ
    answers.sort(() => Math.random() - 0.5);

    setCurrentQuestion(correct);
    setOptions(answers);
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (selectedRomaji) => {
    setTotal(total + 1);
    if (selectedRomaji === currentQuestion.romaji) {
      setScore(score + 1);
      setFeedback('ถูกต้อง! (Correct) 🎉');
      setTimeout(generateQuestion, 1000); // รอ 1 วิแล้วไปข้อต่อไป
    } else {
      setFeedback(`ผิดครับ! คำตอบคือ ${currentQuestion.romaji}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{position: 'absolute', top: 20, left: 20}}>
            <Link to="/" style={{color: 'white', textDecoration: 'none'}}>⬅ กลับหน้าหลัก</Link>
        </div>
        
        <h1>ฝึกอ่านคาตาคานะ (Katakana)</h1>
        
        <div className="score-board">
          คะแนน: {score} / {total}
        </div>

        {currentQuestion && (
          <div className="quiz-container">
            <div className="character-display">
              {currentQuestion.character}
            </div>
            
            <div className="options-grid">
              {options.map((option, index) => (
                <button 
                  key={index} 
                  className="option-button"
                  onClick={() => handleAnswer(option.romaji)}
                >
                  {option.romaji}
                </button>
              ))}
            </div>
            
            {feedback && <div className="feedback">{feedback}</div>}
          </div>
        )}
      </header>
    </div>
  );
}

export default KatakanaGame;