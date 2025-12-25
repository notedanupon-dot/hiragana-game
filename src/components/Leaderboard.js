import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../App.css';

// --- ✅ Component ย่อยสำหรับแสดงแต่ละแถว (คงเดิม) ---
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
        {rank > 3 && `${rank}.`}
      </div>

      {/* ✅ ส่วนแสดง Avatar และ Frame */}
      <div className="rank-avatar-container" style={{ position: 'relative', width: '45px', height: '45px', marginRight: '10px' }}>
         <div 
            style={{ 
               position: 'absolute', 
               top: 0, left: 0, 
               width: '100%', height: '100%', 
               borderRadius: '50%', 
               border: equipped.frame === 'none' ? '2px solid #ddd' : equipped.frame,
               pointerEvents: 'none',
               zIndex: 2
            }}
         ></div>

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
    
    // ⚠️ แก้ไข: ดึงข้อมูลทั้งหมดใน path มาประมวลผล (เอา limitToLast ออกเพื่อให้กรองชื่อซ้ำได้ถูกต้อง)
    const scoreRef = ref(db, `scores/${activeTab}`);

    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const userMap = {};

        // 1. วนลูปข้อมูลทั้งหมดเพื่อหา Max Score ของแต่ละคน
        Object.values(data).forEach((entry) => {
          const name = entry.username || "Unknown";
          const score = parseInt(entry.score || 0);

          if (userMap[name]) {
            // ถ้ามีชื่อนี้แล้ว ให้เช็คว่าคะแนนใหม่เยอะกว่าคะแนนเก่าไหม ถ้าใช่ให้อัปเดต
            if (score > userMap[name].score) {
                userMap[name] = { ...entry, score: score };
            }
          } else {
            // ถ้ายังไม่มีชื่อนี้ ให้เพิ่มเข้าไปเลย
            userMap[name] = { ...entry, score: score };
          }
        });

        // 2. แปลง Object กลับเป็น Array
        const sortedScores = Object.values(userMap);

        // 3. เรียงลำดับจาก มาก -> น้อย
        sortedScores.sort((a, b) => b.score - a.score);

        // 4. ตัดมาแสดงแค่ Top 5 หรือ Top 10 ตามต้องการ (ในที่นี้เอามาทั้งหมด แล้วไป slice ตอน render)
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
          // ✅ แสดงผลแค่ 3 อันดับแรก (หรือเปลี่ยนเลข 3 เป็น 5 ถ้าอยากได้ Top 5)
          scores.slice(0, 3).map((player, index) => (
            <LeaderboardItem key={index} player={player} rank={index + 1} />
          ))
        )}
      </div>
    </div>
  );
}

export default Leaderboard;