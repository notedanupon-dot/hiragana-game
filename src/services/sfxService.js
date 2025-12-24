// src/services/sfxService.js

// ลิงก์เสียงเอฟเฟกต์ (ใช้ลิงก์ฟรีจาก CodeSandbox/Github)
const CORRECT_URL = "https://codesandbox.io/static/wav/correct.wav";
const WRONG_URL = "https://codesandbox.io/static/wav/wrong.wav";

// สร้างตัวแปร Audio เก็บไว้จะได้ไม่ต้องโหลดใหม่ทุกครั้งที่กด
const correctAudio = new Audio(CORRECT_URL);
const wrongAudio = new Audio(WRONG_URL);

// ปรับระดับเสียง (0.0 - 1.0)
correctAudio.volume = 0.5;
wrongAudio.volume = 0.3;

export const playCorrect = () => {
  // รีเซ็ตเวลาให้เริ่มเล่นที่วินาทีที่ 0 (เผื่อกดรัวๆ)
  correctAudio.currentTime = 0;
  correctAudio.play().catch(e => console.error("Audio play failed", e));
};

export const playWrong = () => {
  wrongAudio.currentTime = 0;
  wrongAudio.play().catch(e => console.error("Audio play failed", e));
};