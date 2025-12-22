import React from 'react';
import { Link } from 'react-router-dom';
import hiraganaData from '../data/hiragana';
import '../App.css';

function HiraganaChart() {
  return (
    <div className="App">
      <header className="App-header" style={{minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px'}}>
        <div style={{position: 'fixed', top: 20, left: 20, zIndex: 100}}>
            <Link to="/" className="start-btn" style={{padding: '10px 20px', fontSize: '1rem', textDecoration: 'none'}}>⬅ กลับหน้าหลัก</Link>
        </div>

        <h1 style={{color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>ตารางฮิรางานะ (Hiragana Chart)</h1>
        
        <div className="chart-container">
          <div className="chart-grid">
            {hiraganaData.map((item, index) => (
              <div key={index} className={`chart-item ${!item.character ? 'empty' : ''}`}>
                <div className="chart-char">{item.character}</div>
                <div className="chart-romaji">{item.romaji}</div>
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

export default HiraganaChart;