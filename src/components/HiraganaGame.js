import React, { useState } from 'react';
import Game from '../components/Game';
import { hiraganaData } from '../data/hiragana';
import '../App.css'; 

const HiraganaGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // 1. สร้าง State สำหรับจำว่าเลือกโหมดไหน (false = เลือกตอบ, true = พิมพ์ตอบ)
  const [useInputMode, setUseInputMode] = useState(false); 

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
        // --- หน้าจอเมนู (Menu Screen) ---
        <div className="menu-screen">
          <h1>Hiragana Practice</h1>
          
          {/* 2. ตัวเลือกเปิด/ปิด โหมดพิมพ์ */}
          <div className="mode-selector" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '18px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={useInputMode} 
                onChange={(e) => setUseInputMode(e.target.checked)}
                style={{ transform: 'scale(1.5)', marginRight: '10px' }}
              />
              เปิดโหมดพิมพ์ตอบ (ยาก) ⌨️
            </label>
          </div>

          <button className="start-btn" onClick={handleStart}>
            เริ่มเกม 🚀
          </button>
        </div>
      ) : (
        // --- หน้าจอเกม (Game Screen) ---
        <Game 
          dataset={hiraganaData} 
          username="Guest" 
          category="hiragana"
          onEnd={handleEnd} 
          onCancel={() => setIsPlaying(false)}
          
          // 3. ส่งค่า State เข้าไปบอกเกม
          inputMode={useInputMode} 
        />
      )}
    </div>
  );
};

export default HiraganaGame;