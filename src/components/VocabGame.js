import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vocabData from '../data/vocab'; 
import '../App.css'; 

function VocabGame() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState('');

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * vocabData.length);
    const correct = vocabData[randomIndex];
    
    let answers = [correct];
    while (answers.length < 4) {
      const randomDistractor = vocabData[Math.floor(Math.random() * vocabData.length)];
      if (!answers.find(a => a.meaning === randomDistractor.meaning)) {
        answers.push(randomDistractor);
      }
    }
    
    answers.sort(() => Math.random() - 0.5);

    setCurrentQuestion(correct);
    setOptions(answers);
    setFeedback('');
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (selectedMeaning) => {
    setTotal(total + 1);
    if (selectedMeaning === currentQuestion.meaning) {
      setScore(score + 1);
      setFeedback('ถูกต้อง! (Correct) 🎉');
      setTimeout(generateQuestion, 1000);
    } else {
      setFeedback(`ผิดครับ! คำตอบคือ ${currentQuestion.meaning}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{position: 'absolute', top: 20, left: 20}}>
            <Link to="/" style={{color: 'white', textDecoration: 'none'}}>⬅ กลับหน้าหลัก</Link>
        </div>

        <h1>ทายคำศัพท์ (Vocabulary)</h1>
        
        <div className="score-board">
          คะแนน: {score} / {total}
        </div>

        {currentQuestion && (
          <div className="quiz-container">
            {/* ปรับขนาดตัวอักษรให้เล็กลงหน่อยสำหรับคำศัพท์ยาวๆ */}
            <div className="character-display" style={{fontSize: '4rem'}}>
              {currentQuestion.word}
            </div>
            
            <div className="options-grid">
              {options.map((option, index) => (
                <button 
                  key={index} 
                  className="option-button"
                  style={{fontSize: '1.2rem'}} // ปรับปุ่มให้ตัวหนังสือเล็กลงนิดนึง
                  onClick={() => handleAnswer(option.meaning)}
                >
                  {option.meaning}
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

export default VocabGame;