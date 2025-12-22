import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/scoreService'; // ดึงข้อมูลจัดอันดับ
import '../App.css'; // ใช้ CSS กลาง

function Dashboard({ stats, onStart }) {
  const [leaderboard, setLeaderboard] = useState([]);

  // ดึงข้อมูล Hall of Fame เมื่อโหลดหน้า
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // คำนวณความแม่นยำ (Accuracy) จากประวัติล่าสุด
  const lastAccuracy = stats.history && stats.history.length > 0 
    ? stats.history[stats.history.length - 1].accuracy 
    : 0;

  return (
    <div className="dashboard-container">
      
      {/* 🏆 Hall of Fame Section */}
      <div className="hall-of-fame-card">
        <div className="hof-header">
          <h3>🏆 HALL OF FAME (Top 3)</h3>
        </div>
        <div className="hof-list">
          {leaderboard.length === 0 ? (
            <div style={{padding: '10px', color: '#ccc'}}>กำลังโหลด...</div>
          ) : (
            leaderboard.map((user, index) => (
              <div key={index} className="hof-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{user.username}</span>
                <span className="xp">{user.totalScore} XP</span>
              </div>
            ))
          )}
        </div>
        <div className="hof-footer"></div>
      </div>

      {/* 📊 User Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalCorrect || 0}</div>
          <div className="stat-label">คะแนนรวมของคุณ</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{lastAccuracy}%</div>
          <div className="stat-label">ความแม่นยำล่าสุด</div>
        </div>
      </div>

      {/* ▶️ Start Button (สำคัญมาก ต้องมีปุ่มนี้) */}
      <div style={{marginTop: '30px'}}>
        <button className="start-btn" onClick={onStart}>
          เริ่มเกมทันที
        </button>
      </div>

    </div>
  );
}

export default Dashboard;