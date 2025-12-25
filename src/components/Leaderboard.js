import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import '../App.css';

// --- ✅ สร้าง Component ย่อยสำหรับแสดงแต่ละแถว (เพื่อดึงรูป Avatar แยกรายคน) ---
const LeaderboardItem = ({ player, rank }) => {
  const [equipped, setEquipped] = useState({ avatar: '👤', frame: 'none', bg: '#fff' });

  useEffect(() => {
    // ถ้าเป็น Guest ไม่ต้องไปดึงข้อมูล
    if (player.username === 'Guest') return;

    const db = getDatabase();
    // ดึงข้อมูลการแต่งตัวของ user คนนี้
    const userRef = ref(db, `users/${player.username}/equipped`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setEquipped(data);
      }
    });

    return () => unsubscribe();
  }, [player.username]);

  return (
    <div className={`rank-item rank-${rank}`}>
      <div className="rank-number">
        {rank === 1 && '🥇'}
        {rank === 2 && '🥈'}
        {rank === 3 && '🥉'}
      </div>

      {/* ✅ ส่วนแสดง Avatar และ Frame */}
      <div className="rank-avatar-container" style={{ position: 'relative', width: '45px', height: '45px', marginRight: '10px' }}>
         {/* กรอบรูป (Frame) */}
         <div 
            style={{ 
               position: 'absolute', 
               top: 0, left: 0, 
               width: '100%', height: '100%', 
               borderRadius: '50%', 
               border: equipped.frame === 'none' ? '2px solid #ddd' : equipped.frame,
               pointerEvents: 'none', // ให้คลิกทะลุได้
               zIndex: 2
            }}
         ></div>

         {/* พื้นหลัง (BG) และ ตัวไอคอน (Avatar) */}
         <div 
            style={{
              width: '100%', height: '100%',
              background: equipped.bg,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
              overflow: 'hidden'
            }}
         >
            {equipped.avatar}
         </div>
      </div>

      <div className="rank-info">
        <span className="rank-name">{player.username}</span>
      </div>
      <div className="rank-score">
        {player.score} <small>XP</small>
      </div>
    </div>
  );
};
// --------------------------------------------------------------------------

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('hiragana'); 
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const db = getDatabase();
    
    const scoreRef = query(ref(db, `scores/${activeTab}`), orderByChild('score'), limitToLast(10));

    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      const sortedScores = [];

      if (data) {
        Object.keys(data).forEach(key => {
          sortedScores.push(data[key]);
        });
        // เรียงคะแนนจาก มาก -> น้อย
        sortedScores.sort((a, b) => b.score - a.score);
      }
      
      setScores(sortedScores);
      setLoading(false);
    }, (error) => {
      console.error("Error reading data:", error);
      setLoading(false);
    });

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
          // ✅ เปลี่ยนไปใช้ Component ย่อยที่สร้างไว้ด้านบน
          scores.slice(0, 3).map((player, index) => (
            <LeaderboardItem key={index} player={player} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;