import React, { useState, useEffect } from 'react';
import { hiragana } from '../data/hiragana';
import { katakana } from '../data/katakana';
import { vocab } from '../data/vocab';
const QUESTION_LIMIT = 10;

const Game = ({ dataset, onEnd, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // 'a', 'ka', etc.
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionDetails, setSessionDetails] = useState([]); // Track specifically for this game

  // Initialize Game
  useEffect(() => {
    // Shuffle dataset and pick 10
    const shuffled = [...dataset].sort(() => 0.5 - Math.random()).slice(0, QUESTION_LIMIT);
    
    // Generate options for each question
    const gameQuestions = shuffled.map(q => {
      // Pick 3 random distractors
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

    if (isCorrect) setScore(score + 1);

    // Record detail
    setSessionDetails([...sessionDetails, { 
      romaji: currentQ.romaji, 
      isCorrect 
    }]);

    // Delay before next question
    setTimeout(() => {
      if (currentIndex + 1 < QUESTION_LIMIT) {
        setCurrentIndex(currentIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        // Finish Game
        onEnd({
          score: isCorrect ? score + 1 : score,
          total: QUESTION_LIMIT,
          details: [...sessionDetails, { romaji: currentQ.romaji, isCorrect }]
        });
      }
    }, 1200); // 1.2 second pause to see result
  };

  if (questions.length === 0) return <div>Loading...</div>;

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
        <div className="hiragana-char">{currentQ.char}</div>
      </div>

      <div className="options-grid">
        {currentQ.options.map((opt) => {
          // Determine button style based on state
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