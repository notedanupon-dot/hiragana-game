import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// ลงทะเบียน Component ของ ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Profile = ({ history, username, onBack }) => {
  // --- 1. Logic คำนวณข้อมูลกราฟ (Last 7 Days) ---
  const chartData = useMemo(() => {
    if (!history || history.length === 0) return null;

    // 1.1 จัดกลุ่มคะแนนตามวันที่ (Group by Date)
    const groupedByDate = history.reduce((acc, curr) => {
      const date = curr.date; // รูปแบบ "dd/mm/yyyy"
      if (!acc[date]) {
        acc[date] = { totalScore: 0, count: 0 };
      }
      acc[date].totalScore += curr.score;
      acc[date].count += 1;
      return acc;
    }, {});

    // 1.2 แปลงเป็น Array และเรียงตามวันที่เก่า -> ใหม่
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
       const dateA = new Date(a.split('/').reverse().join('-'));
       const dateB = new Date(b.split('/').reverse().join('-'));
       return dateA - dateB;
    });

    // 1.3 ตัดเอาแค่ 7 วันล่าสุด
    const last7Days = sortedDates.slice(-7);

    // 1.4 หาค่าเฉลี่ยของแต่ละวัน
    const averages = last7Days.map(date => {
      const dayData = groupedByDate[date];
      return Math.round(dayData.totalScore / dayData.count);
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'คะแนนเฉลี่ย (Average Score)',
          data: averages,
          borderColor: 'rgb(108, 99, 255)', // สีเส้น (ม่วง)
          backgroundColor: 'rgba(108, 99, 255, 0.2)', // สีพื้นที่ใต้กราฟ
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(108, 99, 255)',
          pointHoverBackgroundColor: 'rgb(108, 99, 255)',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4, // ความโค้งของเส้น (0 = เส้นตรง, 0.4 = โค้งสวย)
        },
      ],
    };
  }, [history]);

  // --- 2. Logic วิเคราะห์เทรนด์ (ดีขึ้น/แย่ลง) ---
  const analyzeTrend = () => {
    if (!chartData || chartData.datasets[0].data.length < 2) return null;
    
    const data = chartData.datasets[0].data;
    const lastScore = data[data.length - 1];
    const prevScore = data[data.length - 2];
    const diff = lastScore - prevScore;

    if (diff > 0) return { text: `ฟอร์มกำลังมา! (+${diff}) 📈`, color: '#4CAF50' }; // เขียว
    if (diff < 0) return { text: `คะแนนตกลงนิดหน่อย (${diff}) 📉`, color: '#F44336' }; // แดง
    return { text: 'ฟอร์มคงที่ ➖', color: '#FF9800' }; // ส้ม
  };

  const trend = analyzeTrend();

  // --- Options การแสดงผลกราฟ ---
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="profile-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="profile-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eee', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          👤
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{username || 'Guest Player'}</h2>
          <p style={{ margin: 0, color: '#666' }}>สถิติย้อนหลัง 7 วัน</p>
        </div>
      </div>

      <div className="chart-box" style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        {chartData ? (
          <>
            <Line options={options} data={chartData} />
            
            {/* แสดงข้อความวิเคราะห์ Trend */}
            {trend && (
              <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center', fontWeight: 'bold', color: trend.color }}>
                {trend.text}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            ยังไม่มีข้อมูลการเล่น ลองเล่นสักตาเลย! 🎮
          </div>
        )}
      </div>

      <button 
        onClick={onBack}
        style={{ marginTop: '20px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #ddd', borderRadius: '25px', cursor: 'pointer' }}
      >
        ← กลับหน้าเมนู
      </button>
    </div>
  );
};

export default Profile;