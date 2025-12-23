import React from 'react';
import { katakanaData } from '../data/katakana'; // ✅ Import ข้อมูลจริงเข้ามา
import { Link } from 'react-router-dom';
import '../App.css';

function KatakanaChart() {
  return (
    <div className="app-container">
      <header>
        <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        <h1>Katakana Chart <span className="jp-font">カタカナ</span></h1>
      </header>
      
      <main className="chart-container">
        <div className="character-grid">
          {/* ใช้ katakanaData วนลูปแสดงผล */}
          {katakanaData.map((item, index) => (
            <div key={index} className={`char-card ${!item.character ? 'empty' : ''}`}>
              {item.character ? (
                <>
                  <div className="char-jp">{item.character}</div>
                  <div className="char-ro">{item.romaji}</div>
                </>
              ) : (
                <div className="char-empty"></div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default KatakanaChart;