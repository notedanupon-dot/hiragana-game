// src/services/sfxService.js

// สร้าง AudioContext ตัวจัดการเสียง
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ฟังก์ชันสร้างเสียง (Oscillator)
const playTone = (freq, type, duration) => {
  // เช็คว่า AudioContext พร้อมทำงานไหม (บาง Browser ต้องคลิกก่อนถึงจะยอมให้มีเสียง)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = type; // รูปแบบเสียง: 'sine', 'square', 'sawtooth', 'triangle'
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime); // ความถี่เสียง

  // ลดระดับเสียงลงหน่อยจะได้ไม่แสบหู
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playCorrect = () => {
  // เสียง "ปิ๊ง!" (เสียงสูง Sine wave)
  // เล่น 2 โน้ตเร็วๆ ให้เหมือนเสียงเหรียญมาริโอ้
  playTone(600, 'sine', 0.1);
  setTimeout(() => playTone(1200, 'sine', 0.2), 50);
};

export const playWrong = () => {
  // เสียง "ตื๊ด..." (เสียงต่ำ Sawtooth wave)
  playTone(150, 'sawtooth', 0.4);
};