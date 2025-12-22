import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const styles = {
    container: { textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' },
    title: { color: '#333', marginBottom: '40px' },
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' },
    button: {
      padding: '15px 30px',
      fontSize: '18px',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: '250px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🇯🇵 Japanese Master Game</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate('/hiragana')}>
          あ ฝึกฮิรางานะ (Hiragana)
        </button>
        <button style={{...styles.button, backgroundColor: '#2196F3'}} onClick={() => navigate('/katakana')}>
          ア ฝึกคาตาคานะ (Katakana)
        </button>
        <button style={{...styles.button, backgroundColor: '#FF9800'}} onClick={() => navigate('/vocab')}>
          📖 ทายคำศัพท์ (Vocabulary)
        </button>
      </div>
    </div>
  );
}

export default Home;