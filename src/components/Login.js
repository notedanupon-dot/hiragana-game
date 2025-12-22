import React, { useState } from 'react';
import '../App.css';

function Login({ onLogin }) {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      onLogin(inputName.trim());
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <div className="game-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="jp-font" style={{ fontSize: '3rem', marginBottom: '10px' }}>日本語</h1>
        <h2 style={{ marginBottom: '30px' }}>Japanese Master</h2>
        
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>กรุณาใส่ชื่อผู้เล่นเพื่อเริ่มผจญภัย</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="ชื่อของคุณ (เช่น NoteKung)"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.2rem',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              marginBottom: '20px',
              textAlign: 'center'
            }}
            maxLength={15}
            required
          />
          <button type="submit" className="start-btn">
            🚀 เริ่มต้นใช้งาน
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;