import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import '../App.css';

const CHART_DATA = [
  { row: '', chars: [{ char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' }] },
  { row: 'K', chars: [{ char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' }] },
  { row: 'S', chars: [{ char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' }] },
  { row: 'T', chars: [{ char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' }] },
  { row: 'N', chars: [{ char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' }] },
  { row: 'H', chars: [{ char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' }] },
  { row: 'M', chars: [{ char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' }] },
  { row: 'Y', chars: [{ char: 'や', romaji: 'ya' }, { char: null, romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: null, romaji: '' }, { char: 'よ', romaji: 'yo' }] },
  { row: 'R', chars: [{ char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' }] },
  { row: 'W', chars: [{ char: 'わ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'を', romaji: 'wo' }] },
  { row: 'N', chars: [{ char: 'ん', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }] }
];

const HiraganaFillGame = ({ username, onBack }) => {
  const [difficulty, setDifficulty] = useState(null); // null = ยังไม่เลือก, 'normal', 'hard', 'master'
  const [gridState, setGridState] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0); 
  const [gameActive, setGameActive] = useState(false);
  const timerRef = useRef(null);

  // เริ่มเกมเมื่อมีการเปลี่ยนระดับความยาก
  useEffect(() => {
    if (difficulty) {
      initGame(difficulty);
    }
    return () => clearInterval(timerRef.current);
  }, [difficulty]);

  // Logic ของ Timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      // เวลาหมด!
      clearInterval(timerRef.current);
      setGameActive(false);
      alert("⏰ หมดเวลา! พยายามใหม่อีกครั้งนะครับ");
      setDifficulty(null); // กลับไปหน้าเลือกความยาก
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive, timeLeft]);

  const initGame = (selectedDiff) => {
    let initialGrid = [];
    
    // ตั้งเวลาตามความยาก (วินาที)
    let timeLimit = 300; // 5 นาทีสำหรับ Normal
    if (selectedDiff === 'hard') timeLimit = 240; // 4 นาที
    if (selectedDiff === 'master') timeLimit = 180; // 3 นาทีโหดๆ

    setTimeLeft(timeLimit);
    setGameActive(true);

    CHART_DATA.forEach((row) => {
      let rowData = [];
      row.chars.forEach((item) => {
        if (!item.char) {
          rowData.push({ ...item, type: 'empty' });
        } else {
          // Logic ความยากในการซ่อนตัวอักษร
          let isHidden = false;
          
          if (selectedDiff === 'normal') {
            isHidden = Math.random() < 0.5; // สุ่มหาย 50%
          } else {
            isHidden = true; // Hard & Master: หายหมด 100% (ตารางเปล่า)
          }

          rowData.push({
            ...item,
            isHidden: isHidden,
            isCorrect: !isHidden, 
            userInput: ''
          });
        }
      });
      initialGrid.push(rowData);
    });

    setGridState(initialGrid);
    setCompleted(false);
    setScore(0);
  };

  const handleInputChange = (rowIndex, colIndex, value) => {
    if (!gameActive) return; // ถ้าเกมจบแล้วห้ามพิมพ์

    const newGrid = [...gridState];
    const cell = newGrid[rowIndex][colIndex];
    
    cell.userInput = value;

    if (value.toLowerCase() === cell.romaji) {
      cell.isCorrect = true;
      cell.isHidden = false;
      setScore(prev => prev + 10);
      
      // Bonus Time: ตอบถูกได้เวลาเพิ่มนิดหน่อย
      if (difficulty !== 'normal') setTimeLeft(prev => prev + 2);
    }

    setGridState(newGrid);
    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid) => {
    const allCorrect = currentGrid.every(row => 
      row.every(cell => cell.type === 'empty' || cell.isCorrect)
    );

    if (allCorrect && !completed) {
      setCompleted(true);
      setGameActive(false);
      clearInterval(timerRef.current);
      giveRewards();
    }
  };

  const giveRewards = () => {
    if (username && username !== "Guest") {
      const db = getDatabase();
      const userRef = ref(db, `users/${username}/coins`);
      
      // คำนวณโบนัสตามความยาก
      let bonus = 100;
      if (difficulty === 'hard') bonus = 300;
      if (difficulty === 'master') bonus = 500;

      runTransaction(userRef, (currentCoins) => {
        return (currentCoins || 0) + bonus;
      }).then(() => {
        console.log(`Coins added! Bonus: ${bonus}`);
      });
    }
  };

  // --- UI หน้าเลือกความยาก ---
  if (!difficulty) {
    return (
      <div className="game-container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <button onClick={onBack} className="back-btn">⬅ กลับ</button>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>เลือกความท้าทาย 🔥</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="diff-btn normal" onClick={() => setDifficulty('normal')}>
            <span style={{fontSize:'24px'}}>😊</span>
            <div>
              <strong>Normal (ทั่วไป)</strong><br/>
              <small>ตัวอักษรหายไป 50% / มีหัวตารางบอกใบ้</small>
            </div>
          </button>

          <button className="diff-btn hard" onClick={() => setDifficulty('hard')}>
            <span style={{fontSize:'24px'}}>🔥</span>
            <div>
              <strong>Hard (ยาก)</strong><br/>
              <small>ตารางเปล่า (หาย 100%) / มีหัวตารางบอกใบ้ / 💰x3</small>
            </div>
          </button>

          <button className="diff-btn master" onClick={() => setDifficulty('master')}>
            <span style={{fontSize:'24px'}}>👹</span>
            <div>
              <strong>Master (ปีศาจ)</strong><br/>
              <small>ตารางเปล่า + 🚫 ไม่มีหัวตารางบอกใบ้! / 💰x5</small>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- UI หน้าเล่นเกม ---
  return (
    <div className="game-container" style={{ maxWidth: '850px' }}>
      <div className="header-nav" style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={() => setDifficulty(null)} className="back-btn" style={{fontSize: '14px'}}>
           ❌ เลิกเล่น
        </button>
        
        <div style={{textAlign: 'center'}}>
           <div style={{ fontSize: '14px', color: '#888' }}>
             โหมด: {difficulty === 'normal' ? 'Normal' : difficulty === 'hard' ? 'Hard 🔥' : 'Master 👹'}
           </div>
           <h2 style={{margin: '5px 0'}}>Fill the Chart</h2>
        </div>

        <div className={`timer-box ${timeLeft < 30 ? 'danger' : ''}`}>
           ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        คะแนน: <strong>{score}</strong>
      </div>

      {completed && (
        <div className="victory-banner">
          <h3>🎉 สุดยอด! คุณคือผู้พิชิตระดับ {difficulty.toUpperCase()}</h3>
          <p>ได้รับรางวัลมหาศาล! 💰</p>
          <button onClick={() => setDifficulty(null)} className="restart-btn">
            🔄 เล่นใหม่ / เปลี่ยนระดับ
          </button>
        </div>
      )}

      {/* --- GRID TABLE --- */}
      <div className="hiragana-grid">
        
        {/* Header Row (A I U E O) - ซ่อนถ้าเป็นโหมด Master */}
        <div className="grid-header"></div>
        {['a', 'i', 'u', 'e', 'o'].map((h, i) => (
          <div key={i} className="grid-header">
            {difficulty === 'master' ? '?' : h}
          </div>
        ))}

        {gridState.map((row, rIndex) => (
          <React.Fragment key={rIndex}>
            {/* Row Label (K, S, T...) - ซ่อนถ้าเป็นโหมด Master */}
            <div className="row-label">
              {difficulty === 'master' ? '?' : CHART_DATA[rIndex].row}
            </div>
            
            {row.map((cell, cIndex) => {
              if (cell.type === 'empty') {
                return <div key={cIndex} className="grid-cell empty"></div>;
              }

              return (
                <div 
                  key={cIndex} 
                  className={`grid-cell ${cell.isCorrect ? 'correct' : 'pending'}`}
                >
                  {cell.isHidden ? (
                    <input
                      type="text"
                      maxLength={3}
                      className="grid-input"
                      // ปิด hint placeholder ในโหมด hard/master เพื่อความยาก
                      placeholder={difficulty === 'normal' ? "?" : ""} 
                      value={cell.userInput}
                      onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                      disabled={completed || !gameActive}
                    />
                  ) : (
                    <span className="grid-char">{cell.char}</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{height: '50px'}}></div>
    </div>
  );
};

export default HiraganaFillGame;