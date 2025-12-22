import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/scoreService'; // เรียกใช้ฟังก์ชันดึงอันดับ

function Dashboard({ stats, onStart }) {
  const [leaderboard, setLeaderboard] = useState([]);

  // ดึงข้อมูล Ranking เมื่อเข้าหน้า Dashboard
  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getLeaderboard();
      setLeaderboard(data);
    };
    fetchRanking();
  }, []);

  // ฟังก์ชันคำนวณความกว้างของกราฟ (ให้คนคะแนนเยอะสุดเต็มหลอด 100%)
  const getMaxScore = () => leaderboard.length > 0 ? leaderboard[0].totalScore : 100;
  
  const getBarColor = (index) => {
    if (index === 0) return 'linear-gradient(90deg, #FFD700, #FDB931)'; // ทอง
    if (index === 1) return 'linear-gradient(90deg, #E0E0E0, #BDBDBD)'; // เงิน
    if (index === 2) return 'linear-gradient(90deg, #CD7F32, #A0522D)'; // ทองแดง
    return '#4a90e2';
  };

  return (
    <div className="dashboard-container">
      {/* --- ส่วน Ranking (New!) --- */}
      <div className="chart-section" style={{ background: '#2c3e50', color: 'white' }}>
        <h3 className="chart-title" style={{ color: 'white', borderBottom: '1px solid #444' }}>
          🏆 HALL OF FAME (Top 3)
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          {leaderboard.length === 0 ? (
            <p style={{ opacity: 0.7 }}>กำลังโหลดอันดับ...</p>
          ) : (
            leaderboard.map((user, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '20px', fontWeight: 'bold', textAlign: 'center' }}>#{index + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                    <span>{user.username}</span>
                    <span>{user.totalScore} XP</span>
                  </div>
                  <div style={{ 
                    height: '12px', 
                    background: 'rgba(255,255,255,0.2)', 
                    borderRadius: '6px',
                    overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      width: `${(user.totalScore / getMaxScore()) * 100}%`, 
                      height: '100%', 
                      background: getBarColor(index),
                      transition: 'width 1s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ส่วนสถิติส่วนตัว (ของเดิม) --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalCorrect}</div>
          <div className="stat-label">คะแนนรวมของคุณ</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats.totalAttempts > 0 
              ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
              : 0}%
          </div>
          <div className="stat-label">ความแม่นยำ</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;