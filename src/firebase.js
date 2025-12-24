// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. เพิ่ม import AppCheck
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// ⚠️ เอาค่าจาก Firebase Console มาแปะทับตรงนี้ครับ
const firebaseConfig = {
  apiKey: "AIzaSyDn7bqDndbozts8-J9Gv6HgCgYJWRzPSHs",
  authDomain: "japanese-master-e1f13.firebaseapp.com",
  databaseURL: "https://japanese-master-e1f13-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "japanese-master-e1f13",
  storageBucket: "japanese-master-e1f13.firebasestorage.app",
  messagingSenderId: "206529901066",
  appId: "1:206529901066:web:ad075fb8fc652a2db125f3",
  measurementId: "G-67CLC24GGN"
};

const app = initializeApp(firebaseConfig);

// 2. เริ่มต้น App Check (เอา SITE KEY มาใส่ตรงนี้)
// ⚠️ เปลี่ยน "YOUR_SITE_KEY_HERE" เป็นรหัส SITE KEY ที่ได้จากเว็บ reCAPTCHA (ไม่ใช่ Secret Key นะครับ)
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LeQYDUsAAAAAH3Vu0NfW1paGCOJXegpjOH-qea6'),

  // isTokenAutoRefreshEnabled: true หมายถึงให้ต่ออายุ Token อัตโนมัติ
  isTokenAutoRefreshEnabled: true 
});
export const db = getFirestore(app); // ส่งออกตัวแปร db ไปใช้บันทึกข้อมูล
export default app;