import React from 'react';
import { hiraganaData } from '../data/hiragana'; // ดึงข้อมูลตัวอักษร
import { Link } from 'react-router-dom';
import '../App.css';

function HiraganaChart() {
  return (
    <div className="app-container">
      <header>
        <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        <h1>Hiragana Chart <span className="jp-font">ひらがな</span></h1>
      </header>
      
      <main className="chart-container">
        <div className="character-grid">
          {hiraganaData.map((item, index) => (
            <div key={index} className={`char-card ${!item.character ? 'empty' : ''}`}>
              {/* ถ้ามีตัวอักษร ให้แสดง ถ้าไม่มี (ช่องว่าง) ให้ปล่อยโล่ง */}
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

export default HiraganaChart;