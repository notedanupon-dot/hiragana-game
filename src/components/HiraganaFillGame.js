import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import DrawModal from './DrawModal'; // ✅ Import เข้ามา
import '../App.css';

// ... (CHART_DATA คงเดิม) ...
const CHART_DATA = [
    // ... (ข้อมูลเดิมทั้งหมด) ...
    // หากไม่มีให้ copy จากไฟล์เดิมมาใส่ครับ หรือใช้ตัวแปรเดิม
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
  const [difficulty, setDifficulty] = useState(null);
  const [gridState, setGridState] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // State สำหรับโหมดวาดเขียน
  const [isDrawMode, setIsDrawMode] = useState(false); // ✅ Toggle ระหว่าง พิมพ์ / วาด
  const [activeCell, setActiveCell] = useState(null); // ✅ เก็บ cell ที่กำลังวาดอยู่

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0); 
  const [gameActive, setGameActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (difficulty) {
      initGame(difficulty);
    }
    return () => clearInterval(timerRef.current);
  }, [difficulty]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      clearInterval(timerRef.current);
      setGameActive(false);
      alert("⏰ หมดเวลา!");
      setDifficulty(null);
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive, timeLeft]);

  const initGame = (selectedDiff) => {
    let initialGrid = [];
    let timeLimit = 300; 
    if (selectedDiff === 'hard') timeLimit = 240; 
    if (selectedDiff === 'master') timeLimit = 180; 

    setTimeLeft(timeLimit);
    setGameActive(true);

    CHART_DATA.forEach((row, rIndex) => {
      let rowData = [];
      row.chars.forEach((item, cIndex) => {
        if (!item.char) {
          rowData.push({ ...item, type: 'empty' });
        } else {
          let isHidden = false;
          if (selectedDiff === 'normal') isHidden = Math.random() < 0.5;
          else isHidden = true;

          rowData.push({
            ...item,
            rIndex, cIndex, // เก็บพิกัดไว้ใช้อ้างอิงตอนวาด
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
    if (!gameActive) return;

    const newGrid = [...gridState];
    const cell = newGrid[rowIndex][colIndex];
    cell.userInput = value;

    if (value.toLowerCase() === cell.romaji) {
      cell.isCorrect = true;
      cell.isHidden = false;
      setScore(prev => prev + 10);
      if (difficulty !== 'normal') setTimeLeft(prev => prev + 2);
    }

    setGridState(newGrid);
    checkCompletion(newGrid);
  };

  // ✅ ฟังก์ชันเมื่อวาดถูกต้อง (Self-Check Passed)
  const handleDrawSuccess = () => {
    if (!activeCell) return;
    const { rIndex, cIndex } = activeCell;
    
    const newGrid = [...gridState];
    const cell = newGrid[rIndex][cIndex];

    cell.isCorrect = true;
    cell.isHidden = false;
    cell.userInput = '✏️'; // ใส่สัญลักษณ์ว่ามาจากการวาด

    setScore(prev => prev + 10);
    if (difficulty !== 'normal') setTimeLeft(prev => prev + 2);
    
    setGridState(newGrid);
    setActiveCell(null); // ปิด Modal
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
      let bonus = 100;
      if (difficulty === 'hard') bonus = 300;
      if (difficulty === 'master') bonus = 500;

      runTransaction(userRef, (currentCoins) => (currentCoins || 0) + bonus);
    }
  };

  if (!difficulty) {
    return (
      <div className="game-container" style={{ maxWidth: '600px', textAlign: 'center' }}>
         <button onClick={onBack} className="back-btn">⬅ เมนูหลัก</button>
         {/* ... (Code หน้าเลือกความยากเหมือนเดิม) ... */}
         <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>เลือกความท้าทาย 🔥</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {['normal', 'hard', 'master'].map(diff => (
            <button key={diff} className={`diff-btn ${diff}`} onClick={() => setDifficulty(diff)}>
              <span style={{fontSize:'24px'}}>{diff === 'normal' ? '😊' : diff === 'hard' ? '🔥' : '👹'}</span>
              <div style={{textTransform: 'capitalize'}}><strong>{diff}</strong></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="game-container" style={{ maxWidth: '850px' }}>
      
      {/* ✅ Modal วาดเขียน */}
      {activeCell && (
        <DrawModal 
          targetChar={activeCell.char}
          targetRomaji={activeCell.romaji}
          onClose={() => setActiveCell(null)}
          onCorrect={handleDrawSuccess}
        />
      )}

      <div className="header-nav" style={{justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
        <button onClick={() => setDifficulty(null)} className="back-btn" style={{fontSize: '14px'}}>❌ เลิกเล่น</button>
        
        {/* ✅ Toggle Draw Mode */}
        <div 
          onClick={() => setIsDrawMode(!isDrawMode)}
          style={{
            cursor: 'pointer',
            padding: '8px 15px',
            background: isDrawMode ? '#E91E63' : '#ddd',
            color: isDrawMode ? 'white' : '#333',
            borderRadius: '20px',
            fontWeight: 'bold',
            display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          {isDrawMode ? '✏️ โหมดวาด (แตะเพื่อเปลี่ยน)' : '⌨️ โหมดพิมพ์ (แตะเพื่อเปลี่ยน)'}
        </div>

        <div className={`timer-box ${timeLeft < 30 ? 'danger' : ''}`}>
           ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="hiragana-grid" style={{marginTop: '20px'}}>
        <div className="grid-header"></div>
        {['a', 'i', 'u', 'e', 'o'].map((h, i) => (
          <div key={i} className="grid-header">{difficulty === 'master' ? '?' : h}</div>
        ))}

        {gridState.map((row, rIndex) => (
          <React.Fragment key={rIndex}>
            <div className="row-label">{difficulty === 'master' ? '?' : CHART_DATA[rIndex].row}</div>
            
            {row.map((cell, cIndex) => {
              if (cell.type === 'empty') return <div key={cIndex} className="grid-cell empty"></div>;

              return (
                <div 
                  key={cIndex} 
                  className={`grid-cell ${cell.isCorrect ? 'correct' : 'pending'}`}
                  // ✅ ถ้าเป็นโหมดวาด และยังไม่ถูก ให้คลิกเปิด Modal
                  onClick={() => {
                    if (isDrawMode && cell.isHidden && gameActive) {
                      setActiveCell(cell);
                    }
                  }}
                  style={{ cursor: (isDrawMode && cell.isHidden) ? 'pointer' : 'default' }}
                >
                  {cell.isHidden ? (
                    isDrawMode ? (
                       // ✅ แสดงไอคอนดินสอถ้าอยู่ในโหมดวาด
                       <span style={{fontSize: '20px', opacity: 0.5}}>✏️</span>
                    ) : (
                      <input
                        type="text"
                        maxLength={3}
                        className="grid-input"
                        placeholder={difficulty === 'normal' ? "?" : ""} 
                        value={cell.userInput}
                        onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                        disabled={completed || !gameActive}
                      />
                    )
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