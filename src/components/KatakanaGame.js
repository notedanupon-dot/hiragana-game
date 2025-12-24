import React, { useState } from 'react';
import { katakanaData } from '../data/katakana';
import Game from '../components/Game';
import '../App.css'; // เรียกใช้ CSS รวมเพื่อให้หน้าตาเหมือนกัน

const KatakanaGame = ({ username }) => {
  // 1. ใช้ State ง่ายๆ แค่ว่าเล่นอยู่หรือไม่ (isPlaying)
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 2. State สำหรับโหมดพิมพ์
  const [useInputMode, setUseInputMode] = useState(false);

  // กรองข้อมูล: เอาเฉพาะที่มีตัวอักษร (กัน Error)
  const activeGameData = katakanaData.filter(item => item.character && item.character !== '');

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleEnd = (result) => {
    console.log("Game Ended", result);
    setIsPlaying(false);
  };

  return (
    <div className="game-container">
      {!isPlaying ? (
        // --- ส่วนหน้าจอเมนู (เลียนแบบ HiraganaGame) ---
        <div className="menu-screen">
          <h1>Katakana Mastery <span className="jp-font">カタカナ</span></h1>
          
          {/* ตัวเลือกเปิด/ปิด โหมดพิมพ์ */}
          <div className="mode-selector" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={useInputMode} 
                onChange={(e) => setUseInputMode(e.target.checked)}
                style={{ transform: 'scale(1.5)' }}
              />
              เปิดโหมดพิมพ์ตอบ (ยาก) ⌨️
            </label>
          </div>

          <button className="start-btn" onClick={handleStart}>
            เริ่มเกม 🚀
          </button>
        </div>
      ) : (
        // --- ส่วนหน้าจอเกม ---
        <Game 
          dataset={activeGameData} 
          username={username || "Guest"} 
          category="katakana"
          onEnd={handleEnd} 
          onCancel={() => setIsPlaying(false)}
          
          // ส่งค่าโหมดที่เลือกเข้าไป
          inputMode={useInputMode} 
        />
      )}
    </div>
  );
};

export default KatakanaGame;