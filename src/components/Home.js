import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <div className="App">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="main-title">Japanese <span>Master</span></h1>
        <p className="sub-title">ฝึกภาษาญี่ปุ่นวันละนิด เก่งขึ้นแน่นอน! 🇯🇵</p>
      </div>

      <div className="section-label">🎮 โหมดฝึกฝน (Games)</div>

      <div className="menu-grid">
        {/* Card: Hiragana */}
        <div className="menu-card">
          <div className="card-icon">あ</div>
          <h2 className="card-title">ฝึกฮิรางานะ</h2>
          <p className="card-desc">ทายตัวอักษรพื้นฐานให้ถูกต้อง</p>
          <Link to="/game/hiragana" className="action-btn btn-hira">
            เริ่มเล่นเลย!
          </Link>
          <Link to="/chart-hiragana" className="action-btn btn-outline">
            ดูตารางตัวอักษร
          </Link>
        </div>

        {/* Card: Katakana */}
        <div className="menu-card">
          <div className="card-icon">ア</div>
          <h2 className="card-title">ฝึกคาตาคานะ</h2>
          <p className="card-desc">จำตัวอักษรสำหรับคำทับศัพท์</p>
          <Link to="/game/katakana" className="action-btn btn-kata">
            เริ่มเล่นเลย!
          </Link>
          <Link to="/chart-katakana" className="action-btn btn-outline">
            ดูตารางตัวอักษร
          </Link>
        </div>

        {/* Card: Vocabulary */}
        <div className="menu-card">
          <div className="card-icon">📖</div>
          <h2 className="card-title">ทายคำศัพท์</h2>
          <p className="card-desc">สะสมคลังคำศัพท์ในชีวิตประจำวัน</p>
          <Link to="/game/vocabulary" className="action-btn btn-vocab">
            เริ่มเล่นเลย!
          </Link>
        </div>
      </div>
      
      <footer style={{marginTop: '50px', color: '#999', fontSize: '0.9rem'}}>
        Create with ❤️ by You
      </footer>
    </div>
  );
}

export default Home;