// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ เอาค่าจาก Firebase Console มาแปะทับตรงนี้ครับ
const firebaseConfig = {
  apiKey: "AIzaSyDn7bqDndbozts8-J9Gv6HgCgYJWRzPSHs",
  authDomain: "japanese-master-e1f13.firebaseapp.com",
  projectId: "japanese-master-e1f13",
  storageBucket: "japanese-master-e1f13.firebasestorage.app",
  messagingSenderId: "206529901066",
  appId: "1:206529901066:web:ad075fb8fc652a2db125f3",
  measurementId: "G-67CLC24GGN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ส่งออกตัวแปร db ไปใช้บันทึกข้อมูล