import React, { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import '../App.css';

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('hiragana'); // แท็บเริ่มต้น
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก Firebase
  useEffect(() => {
    setLoading(true);
    const db = getDatabase();
    // สมมติว่าเก็บข้อมูลใน path: scores/hiragana, scores/katakana, etc.
    // หรือถ้าคุณเก็บรวมกัน อาจต้องปรับ path ตรงนี้
    const scoreRef = query(ref(db, `scores/${activeTab}`), orderByChild('score'), limitToLast(10));

    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      const sortedScores = [];
      
      if (data) {
        // แปลง Object เป็น Array และเรียงลำดับจากมากไปน้อย
        Object.keys(data).forEach(key => {
          sortedScores.push(data[key]);
        });
        sortedScores.sort((a, b) => b.score - a.score); // เรียงคะแนนมาก -> น้อย
      } else {
        // Mock Data (ข้อมูลจำลองถ้ายังไม่มีข้อมูลจริงใน Database)
        // ลบส่วน else นี้ออกเมื่อต่อ Database จริงสมบูรณ์แล้ว
        const mockData = [
          { username: 'Note IT', score: 150 },
          { username: 'Kenji', score: 120 },
          { username: 'Sakura', score: 95 },
          { username: 'Ryu', score: 80 },
          { username: 'Momo', score: 45 },
        ];
        // สุ่มคะแนนให้ต่างกันตามแท็บเพื่อความสมจริง
        if(activeTab === 'katakana') mockData.forEach(d => d.score -= 10);
        if(activeTab === 'vocab') mockData.forEach(d => d.score += 20);
        
        // setScores(mockData); // *เปิดบรรทัดนี้ถ้าจะทดสอบแบบไม่มี Firebase*
      }
      
      // ถ้าใช้ Firebase จริง ให้ใช้บรรทัดนี้:
      // setScores(sortedScores);
      
      // *สำหรับตอนนี้ผมขอใช้ Mock Data เพื่อให้คุณเห็นหน้าตาก่อนครับ*
      const mockData = [
          { username: 'Sensei Note', score: 2500 },
          { username: 'Ninja A', score: 1850 },
          { username: 'Samurai B', score: 1200 },
          { username: 'Student C', score: 890 },
          { username: 'Guest', score: 50 },
      ];
       setScores(mockData); // ใช้ข้อมูลจำลองแสดงผล
       setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  return (
    <div className="leaderboard-card">
      <div className="leaderboard-header">
        <h2>🏆 Hall of Fame</h2>
        <p>สุดยอดผู้พิชิตภาษาญี่ปุ่น</p>
      </div>

      {/* Tabs เลือกหมวดหมู่ */}
      <div className="leaderboard-tabs">
        <button 
          className={activeTab === 'hiragana' ? 'active' : ''} 
          onClick={() => setActiveTab('hiragana')}
        >
          Hiragana
        </button>
        <button 
          className={activeTab === 'katakana' ? 'active' : ''} 
          onClick={() => setActiveTab('katakana')}
        >
          Katakana
        </button>
        <button 
          className={activeTab === 'vocab' ? 'active' : ''} 
          onClick={() => setActiveTab('vocab')}
        >
          Vocab
        </button>
      </div>

      {/* รายชื่อผู้เล่น */}
      <div className="ranking-list">
        {loading ? (
          <p className="loading-text">กำลังโหลด...</p>
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