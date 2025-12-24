// src/services/audioService.js

export const playAudio = (text) => {
  // เช็คว่า Browser รองรับระบบเสียงไหม
  if (!window.speechSynthesis) {
    console.error("Browser does not support speech synthesis");
    return;
  }

  // หยุดเสียงเก่าก่อน (กรณีคนกดรัวๆ)
  window.speechSynthesis.cancel();

  // สร้างออบเจ็คเสียงพูด
  const utterance = new SpeechSynthesisUtterance(text);
  
  // 🇯🇵 ตั้งค่าภาษาเป็นญี่ปุ่น (สำคัญมาก!)
  utterance.lang = 'ja-JP'; 
  
  // ปรับความเร็ว (1 = ปกติ, 0.8 = ช้าลงหน่อยสำหรับผู้เรียน)
  utterance.rate = 0.8; 
  
  // ปรับระดับเสียง
  utterance.volume = 1;

  // สั่งให้พูด
  window.speechSynthesis.speak(utterance);
};