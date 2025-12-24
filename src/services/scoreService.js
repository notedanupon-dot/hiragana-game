import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// 1. ฟังก์ชันบันทึกคะแนน (Save Score)
export const saveScoreToFirebase = async (username, score, category) => {
  try {
    await addDoc(collection(db, "scores"), {
      username: username,
      score: score,
      category: category,
      date: new Date().toISOString()
    });
    console.log("Score saved!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// 2. ✅ ฟังก์ชันดึง Leaderboard (ตัวที่ Error หาไม่เจอ)
export const getLeaderboard = async (category) => {
  try {
    // สร้าง Query: เลือก collection 'scores', กรองตาม category, เรียงจากมากไปน้อย, เอาแค่ 10 อันดับ
    const q = query(
      collection(db, "scores"),
      where("category", "==", category),
      orderBy("score", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    
    // แปลงข้อมูลให้อยู่ในรูปแบบ Array
    const leaderboardData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return []; // ถ้า error ให้ส่ง array ว่างกลับไป กันแอปพัง
  }
};