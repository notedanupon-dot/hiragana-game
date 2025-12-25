import React, { useState, useEffect } from 'react';
import { getDatabase, ref, runTransaction } from 'firebase/database';
import '../App.css'; // เราจะเพิ่ม CSS ของตารางในนี้

// ข้อมูลตารางฮิรางานะ (5 คอลัมน์ x 10+1 แถว)
const CHART_DATA = [
  { row: '', chars: [
      { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' }
    ] 
  },
  { row: 'K', chars: [
      { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' }
    ] 
  },
  { row: 'S', chars: [
      { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' }
    ] 
  },
  { row: 'T', chars: [
      { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' }
    ] 
  },
  { row: 'N', chars: [
      { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' }
    ] 
  },
  { row: 'H', chars: [
      { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' }
    ] 
  },
  { row: 'M', chars: [
      { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' }
    ] 
  },
  { row: 'Y', chars: [
      { char: 'や', romaji: 'ya' }, { char: null, romaji: '' }, { char: 'ゆ', romaji: 'yu' }, { char: null, romaji: '' }, { char: 'よ', romaji: 'yo' }
    ] 
  },
  { row: 'R', chars: [
      { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' }
    ] 
  },
  { row: 'W', chars: [
      { char: 'わ', romaji: 'wa' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: 'を', romaji: 'wo' }
    ] 
  },
  { row: 'N', chars: [
      { char: 'ん', romaji: 'n' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }, { char: null, romaji: '' }
    ] 
  }
];

const HiraganaFillGame = ({ username, onBack }) => {
  const [gridState, setGridState] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // เริ่มเกม: สุ่มซ่อนตัวอักษร
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    let initialGrid = [];
    let totalBlanks = 0;

    CHART_DATA.forEach((row, rowIndex) => {
      let rowData = [];
      row.chars.forEach((item, colIndex) => {
        if (!item.char) {
          // ช่องว่างตามธรรมชาติ (เช่น Yi, Ye)
          rowData.push({ ...item, type: 'empty' });
        } else {
          // สุ่มว่าจะซ่อนหรือไม่ (50% chance)
          const isHidden = Math.random() < 0.5; 
          if (isHidden) totalBlanks++;
          
          rowData.push({
            ...item,
            isHidden: isHidden, // ถ้า true ต้องพิมพ์ตอบ
            isCorrect: !isHidden, // ถ้าไม่ซ่อน ถือว่าถูกอยู่แล้ว
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
    const newGrid = [...gridState];
    const cell = newGrid[rowIndex][colIndex];
    
    // อัปเดตค่าที่พิมพ์
    cell.userInput = value;

    // ตรวจคำตอบ (เทียบ Romaji แบบ Case Insensitive)
    if (value.toLowerCase() === cell.romaji) {
      cell.isCorrect = true;
      cell.isHidden = false; // เปิดเผยตัวอักษรจริง
      setScore(prev => prev + 10); // ได้คะแนน
    }

    setGridState(newGrid);
    checkCompletion(newGrid);
  };

  const checkCompletion = (currentGrid) => {
    // เช็คว่าทุกช่องที่เป็นตัวอักษร (ไม่ใช่ null) ถูกตอบถูกหมดแล้วหรือยัง
    const allCorrect = currentGrid.every(row => 
      row.every(cell => cell.type === 'empty' || cell.isCorrect)
    );

    if (allCorrect && !completed) {
      setCompleted(true);
      giveRewards();
    }
  };

  const giveRewards = () => {
    if (username && username !== "Guest") {
      const db = getDatabase();
      const userRef = ref(db, `users/${username}/coins`);
      const bonus = 100; // โบนัสจบเกม

      runTransaction(userRef, (currentCoins) => {
        return (currentCoins || 0) + bonus;
      }).then(() => {
        console.log("Coins added!");
      });
    }
  };

  return (
    <div className="game-container" style={{ maxWidth: '800px' }}>
      <div className="header-nav">
        <button onClick={onBack} className="back-btn">⬅ เมนูหลัก</button>
        <h2 style={{margin:0}}>เติมคำในช่องว่าง (Fill the Chart)</h2>
      </div>

      <div style={{ margin: '15px 0', fontSize: '18px' }}>
        คะแนน: <strong>{score}</strong>
      </div>

      {completed && (
        <div className="victory-banner" style={{background: '#4CAF50', color: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px'}}>
          <h3>🎉 ยินดีด้วย! คุณเติมครบทุกช่องแล้ว</h3>
          <p>ได้รับโบนัส +100 Coins 💰</p>
          <button onClick={initGame} style={{padding: '10px 20px', borderRadius: '20px', border: 'none', background: 'white', color: '#4CAF50', fontWeight: 'bold', cursor: 'pointer'}}>
            🔄 เล่นอีกครั้ง (สุ่มใหม่)
          </button>
        </div>
      )}

      {/* --- GRID TABLE --- */}
      <div className="hiragana-grid">
        {/* Header Row (A I U E O) */}
        <div className="grid-header"></div>
        <div className="grid-header">a</div>
        <div className="grid-header">i</div>
        <div className="grid-header">u</div>
        <div className="grid-header">e</div>
        <div className="grid-header">o</div>

        {gridState.map((row, rIndex) => (
          <React.Fragment key={rIndex}>
            {/* Row Label (K, S, T...) */}
            <div className="row-label">{CHART_DATA[rIndex].row}</div>
            
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
                      placeholder="?"
                      value={cell.userInput}
                      onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                    />
                  ) : (
                    <span className="grid-char">{cell.char}</span>
                  )}
                  {/* แสดง Romaji ตัวเล็กๆ ด้านล่างเพื่อเฉลย/บอกใบ้ (ถ้าตอบถูกแล้ว) */}
                  {!cell.isHidden && <small className="romaji-hint">{cell.romaji}</small>}
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