import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import DrawModal from './DrawModal'; // ✅ ใช้ DrawModal ตัวเดิมได้เลย
import '../App.css';

// ข้อมูลตารางคาตาคานะ
const CHART_DATA = [
  { row: '', chars: [{ char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' }] },
  { row: 'K', chars: [{ char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' }] },
  { row: 'S', chars: [{ char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' }] },
  { row: 'T', chars: [{ char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' }] },
  { row: 'N', chars: [{ char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' }] },
  { row: 'H', chars: [{ char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' }] },
  { row: 'M', chars: [{ char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' }] },
  { row: 'Y', chars: [{ char: 'ヤ', romaji: 'ya' }, { char: null, romaji: '' }, { char: 'ユ', romaji: 'yu' }, { char: null, romaji: '' }, { char: 'ヨ', romaji: 'yo' }] },
  { row: 'R', chars: [{ char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' }] },
  { row: 'W', chars: [{ char: 'ワ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'ヲ', romaji: 'wo' }] },
  { row: 'N', chars: [{ char: 'ン', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }] }
];

const KatakanaFillGame = ({ username, onBack }) => {
  const [difficulty, setDifficulty] = useState(null);
  const [gridState, setGridState] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // State สำหรับโหมดวาดเขียน
  const [activeCell, setActiveCell] = useState(null); 

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
          // Normal: สุ่มหาย 50%, Hard/Master: หาย 100%
          if (selectedDiff === 'normal') isHidden = Math.random() < 0.5;
          else isHidden = true;

          rowData.push({
            ...item,
            rIndex, cIndex,
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

  // ✅ ฟังก์ชันเมื่อวาดถูกต้อง (Self-Check Passed)
  const handleDrawSuccess = () => {
    if (!activeCell) return;
    const { rIndex, cIndex } = activeCell;
    
    const newGrid = [...gridState];
    const cell = newGrid[rIndex][cIndex];

    cell.isCorrect = true;
    cell.isHidden = false;
    cell.userInput = '✏️'; 

    setScore(prev => prev + 10);
    // เพิ่มเวลาเล็กน้อยเป็นรางวัล
    if (difficulty !== 'normal') setTimeLeft(prev => prev + 2);
    
    setGridState(newGrid);
    setActiveCell(null);
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

  // UI เลือกความยาก
  if (!difficulty) {
    return (
      <div className="game-container" style={{ maxWidth: '600px', textAlign: 'center' }}>
         <button onClick={onBack} className="back-btn">⬅ เมนูหลัก</button>
         <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>เลือกความท้าทาย 🔥</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {['normal', 'hard', 'master'].map(diff => (
            <button key={diff} className={`diff-btn ${diff}`} onClick={() => setDifficulty(diff)}>
              <span style={{fontSize:'24px'}}>{diff === 'normal' ? '😊' : diff === 'hard' ? '🔥' : '👹'}</span>
              <div style={{textTransform: 'capitalize'}}>
                <strong>{diff}</strong><br/>
                <small style={{color: '#666', fontWeight: 'normal'}}>
                  {diff === 'normal' ? 'ตารางหายบางส่วน (มีใบ้)' : diff === 'hard' ? 'ตารางเปล่า (มีหัวตาราง)' : 'ตารางเปล่า (ไม่มีตัวช่วย!)'}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // UI หน้าเล่นเกม
  return (
    <div className="game-container" style={{ maxWidth: '850px' }}>
      
      {/* Modal วาดเขียน */}
      {activeCell && (
        <DrawModal 
          targetChar={activeCell.char}
          targetRomaji={activeCell.romaji}
          onClose={() => setActiveCell(null)}
          onCorrect={handleDrawSuccess}
        />
      )}

      <div className="header-nav" style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <button onClick={() => setDifficulty(null)} className="back-btn" style={{fontSize: '14px'}}>❌ เลิกเล่น</button>
        
        <div style={{textAlign: 'center'}}>
           <div style={{ fontSize: '14px', color: '#888' }}>
             โหมด: {difficulty.toUpperCase()}
           </div>
           <h2 style={{margin: '5px 0'}}>เขียนตารางคาตาคานะ ✏️</h2>
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
                  // ✅ คลิกเพื่อวาด
                  onClick={() => {
                    if (cell.isHidden && gameActive) {
                      setActiveCell(cell);
                    }
                  }}
                  style={{ 
                    cursor: (cell.isHidden && gameActive) ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  {cell.isHidden ? (
                    <div style={{opacity: 0.4, fontSize: '24px'}}>
                       {difficulty === 'normal' ? '?' : '✏️'}
                    </div>
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

export default KatakanaFillGame;