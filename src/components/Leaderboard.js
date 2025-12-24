import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import '../App.css';

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('hiragana'); 
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const db = getDatabase();
    
    // อ้างอิงไปที่ path: scores/hiragana (หรือหมวดอื่นๆ)
    // เรียงตามคะแนน (score) และเอาแค่ 10 อันดับล่าสุด
    const scoreRef = query(ref(db, `scores/${activeTab}`), orderByChild('score'), limitToLast(10));

    // onValue คือหัวใจของ Realtime (จะทำงานทุกครั้งที่ Database มีการเปลี่ยนแปลง)
    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      const sortedScores = [];

      if (data) {
        // แปลงข้อมูลจาก Object เป็น Array
        Object.keys(data).forEach(key => {
          sortedScores.push(data[key]);
        });
        // เรียงคะแนนจาก มาก -> น้อย
        sortedScores.sort((a, b) => b.score - a.score);
      }
      
      setScores(sortedScores);
      setLoading(false); // โหลดเสร็จแล้ว
    }, (error) => {
      console.error("Error reading data:", error);
      setLoading(false);
    });

    // คืนค่าฟังก์ชันเพื่อหยุดฟังเมื่อเปลี่ยนหน้า
    return () => unsubscribe();
  }, [activeTab]);

  return (
    <div className="leaderboard-card">
      <div className="leaderboard-header">
        <h2>🏆 Hall of Fame (Real Time)</h2>
        <p>สุดยอดผู้พิชิตภาษาญี่ปุ่น</p>
      </div>

      <div className="leaderboard-tabs">
        <button className={activeTab === 'hiragana' ? 'active' : ''} onClick={() => setActiveTab('hiragana')}>Hiragana</button>
        <button className={activeTab === 'katakana' ? 'active' : ''} onClick={() => setActiveTab('katakana')}>Katakana</button>
        <button className={activeTab === 'vocab' ? 'active' : ''} onClick={() => setActiveTab('vocab')}>Vocab</button>
      </div>

      <div className="ranking-list">
        {loading ? (
          <p className="loading-text">กำลังเชื่อมต่อฐานข้อมูล...</p>
        ) : scores.length === 0 ? (
          <div style={{padding: '20px', color: '#999'}}>
            <p>ยังไม่มีผู้เล่นในหมวดนี้</p>
            <small>มาเล่นเป็นคนแรกกันเถอะ!</small>
          </div>
        ) : (
          scores.map((player, index) => (
            <div key={index} className={`rank-item rank-${index + 1}`}>
              <div className="rank-number">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              <div className="rank-info">
                <span className="rank-name">{player.username}</span>
              </div>
              <div className="rank-score">
                {player.score} <small>XP</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;