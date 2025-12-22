// src/services/scoreService.js
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// ฟังก์ชันบันทึกคะแนน (บวกเพิ่มจากของเดิม)
export const saveScoreToFirebase = async (username, pointsToAdd) => {
  if (!username) return;

  const userRef = doc(db, "users", username);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // ถ้ามีชื่อนี้อยู่แล้ว ให้บวกคะแนนเพิ่ม
      await updateDoc(userRef, {
        totalScore: increment(pointsToAdd),
        lastPlayed: new Date()
      });
    } else {
      // ถ้าเป็นผู้เล่นใหม่ ให้สร้างข้อมูลใหม่
      await setDoc(userRef, {
        username: username,
        totalScore: pointsToAdd,
        lastPlayed: new Date()
      });
    }
  } catch (error) {
    console.error("Error saving score:", error);
  }
};

// ฟังก์ชันดึง 3 อันดับแรก
export const getLeaderboard = async () => {
  try {
    const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(3));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};