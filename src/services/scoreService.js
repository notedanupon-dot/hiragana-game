import { getDatabase, ref, push, set, get, query, orderByChild, limitToLast } from "firebase/database";

// 1. ฟังก์ชันบันทึกคะแนน (ใช้ Realtime Database)
export const saveScoreToFirebase = (username, score, category) => {
  const db = getDatabase();
  // ป้องกันกรณีไม่ส่ง category มา ให้ default เป็น 'hiragana'
  const validCategory = category || 'hiragana';
  
  // อ้างอิงไปที่ path: scores/หมวดหมู่
  const scoreRef = ref(db, 'scores/' + validCategory);
  
  // สร้าง key ใหม่แบบสุ่ม (push)
  const newScoreRef = push(scoreRef);
  
  // บันทึกข้อมูล
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

// 2. ฟังก์ชันดึง Leaderboard (ใช้ Realtime Database)
// (ใส่ไว้เพื่อแก้ Error 'getLeaderboard not exported' แม้ว่า Leaderboard.js หลักจะใช้ onValue ก็ตาม)
export const getLeaderboard = async (category) => {
  const db = getDatabase();
  const validCategory = category || 'hiragana';
  const scoreRef = query(ref(db, `scores/${validCategory}`), orderByChild('score'), limitToLast(10));
  
  try {
    const snapshot = await get(scoreRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // แปลง Object เป็น Array แล้วเรียงลำดับ
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