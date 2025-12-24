// ✅ Import db มาจากไฟล์ firebase.js ของเราเอง (ป้องกัน error เรื่องหา database ไม่เจอ)
import { db } from '../firebase'; 
import { ref, push, set, get, query, orderByChild, limitToLast } from "firebase/database";

// 1. ฟังก์ชันบันทึกคะแนน
export const saveScoreToFirebase = (username, score, category) => {
  const validCategory = category || 'hiragana';
  
  // ใช้ db ที่ import มา
  const scoreRef = ref(db, 'scores/' + validCategory);
  const newScoreRef = push(scoreRef);
  
  set(newScoreRef, {
    username: username || "Guest",
    score: score,
    timestamp: Date.now()
  }).then(() => {
    console.log(`Score saved to ${validCategory} successfully!`);
  }).catch((error) => {
    console.error("Error saving score:", error);
  });
};

// 2. ฟังก์ชันดึง Leaderboard
export const getLeaderboard = async (category) => {
  const validCategory = category || 'hiragana';
  // ใช้ db ที่ import มา
  const scoreRef = query(ref(db, `scores/${validCategory}`), orderByChild('score'), limitToLast(10));
  
  try {
    const snapshot = await get(scoreRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const sortedScores = Object.keys(data).map(key => data[key]);
      sortedScores.sort((a, b) => b.score - a.score);
      return sortedScores;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
};