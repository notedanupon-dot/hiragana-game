import React from 'react';
import { Link } from 'react-router-dom';

function KatakanaGame() {
  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      <h1>โซนคำศัพท์ (กำลังสร้าง...)</h1>
      <Link to="/">กลับหน้าหลัก</Link>
    </div>
  );
}
export default KatakanaGame;