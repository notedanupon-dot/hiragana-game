import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../App.css';

// ✅ ฟังก์ชันช่วยแปลงสไตล์กรอบรูป
const getFrameStyle = (frameType) => {
  if (!frameType || frameType === 'none') {
    return { border: '2px solid #ddd' }; // กรอบปกติใน Leaderboard
  }

  // 🌈 กรอบสายรุ้ง
  if (frameType === 'rainbow') {
    return {
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      borderRadius: '50%'
    };
  }

  // 💡 กรอบนีออน
  if (frameType === 'neon') {
    return {
      border: '2px solid #fff',
      boxShadow: '0 0 5px #FF00FF, 0 0 10px #FF00FF',
      borderRadius: '50%'
    };
  }

  // กรอบสีปกติ
  return {
    border: frameType,
    borderRadius: '50%'
  };
};

// --- Component ย่อยสำหรับแสดงแต่ละแถว ---
const LeaderboardItem = ({ player, rank }) => {
  const [equipped, setEquipped] = useState({ avatar: '👤', frame: 'none', bg: '#fff' });

  useEffect(() => {
    if (player.username === 'Guest') return;

    const db = getDatabase();
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
        {/* เนื่องจากแสดงแค่ 3 อันดับ จึงไม่ต้องมีเคส rank > 3 */}
      </div>

      {/* ส่วนแสดง Avatar และ Frame */}
      <div className="rank-avatar-container" style={{ position: 'relative', width: '45px', height: '45px', marginRight: '10px' }}>
         
         {/* Layer กรอบรูป */}
         <div 
            style={{ 
               position: 'absolute', 
               top: 0, left: 0, 
               width: '100%', height: '100%', 
               ...getFrameStyle(equipped.frame), 
               pointerEvents: 'none',
               zIndex: 2
            }}
         ></div>

         {/* Layer พื้นหลังและ Avatar */}
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
    
    const scoreRef = ref(db, `scores/${activeTab}`);

    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const userMap = {};

        // 1. วนลูปข้อมูลเพื่อหา Max Score และตัดชื่อซ้ำ
        Object.values(data).forEach((entry) => {
          const name = entry.username || "Unknown";
          const score = parseInt(entry.score || 0);

          // Logic: เก็บเฉพาะคะแนนสูงสุดของชื่อนั้นๆ
          if (userMap[name]) {
            if (score > userMap[name].score) {
                userMap[name] = { ...entry, score: score };
            }
          } else {
            userMap[name] = { ...entry, score: score };
          }
        });

        // 2. แปลงเป็น Array และเรียงลำดับจากมากไปน้อย
        const sortedScores = Object.values(userMap);
        sortedScores.sort((a, b) => b.score - a.score);

        setScores(sortedScores);
      } else {
        setScores([]);
      }
      
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
          // ✅ จุดแก้ไข: slice(0, 3) เพื่อแสดงแค่ 3 อันดับแรก
          scores.slice(0, 3).map((player, index) => (
            <LeaderboardItem key={index} player={player} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;