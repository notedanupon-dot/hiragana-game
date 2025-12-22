import React from 'react';
// import { katakanaData } from '../data/katakana'; // (ถ้ามีไฟล์นี้แล้วให้เปิดใช้)
import { Link } from 'react-router-dom';
import '../App.css';

// ถ้ายังไม่มีไฟล์ data/katakana ให้ใช้ข้อมูลจำลองไปก่อนเพื่อให้หน้าเว็บไม่พัง
const mockKatakana = [
  { character: 'ア', romaji: 'a' }, { character: 'イ', romaji: 'i' }, { character: 'ウ', romaji: 'u' }, 
  { character: 'エ', romaji: 'e' }, { character: 'オ', romaji: 'o' },
  { character: 'カ', romaji: 'ka' }, { character: 'キ', romaji: 'ki' }, { character: 'ク', romaji: 'ku' }, 
  { character: 'ケ', romaji: 'ke' }, { character: 'コ', romaji: 'ko' }
];

function KatakanaChart() {
  // เช็คว่ามีข้อมูลจริงไหม ถ้าไม่มีให้ใช้ข้อมูลจำลอง
  // const data = katakanaData || mockKatakana; 
  const data = mockKatakana; 

  return (
    <div className="app-container">
      <header>
        <Link to="/" className="back-link">← กลับหน้าหลัก</Link>
        <h1>Katakana Chart <span className="jp-font">カタカナ</span></h1>
      </header>
      
      <main className="chart-container">
        <div className="character-grid">
          {data.map((item, index) => (
            <div key={index} className="char-card">
              <div className="char-jp">{item.character}</div>
              <div className="char-ro">{item.romaji}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default KatakanaChart;