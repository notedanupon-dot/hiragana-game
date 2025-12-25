import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { shopItems } from '../data/shopItems';
import '../Shop.css'; // เดี๋ยวสร้าง CSS แยก

const Shop = ({ username, onBack }) => {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]); // เก็บ id ของที่ซื้อแล้ว
  const [equipped, setEquipped] = useState({ avatar: '👤', frame: 'none', bg: '#fff' });
  const [activeTab, setActiveTab] = useState('avatar'); // avatar, frame, bg

  // โหลดข้อมูลผู้เล่นจาก Firebase
  useEffect(() => {
    if (!username) return;
    const db = getDatabase();
    const userRef = ref(db, `users/${username}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCoins(data.coins || 0);
        setInventory(data.inventory || []);
        setEquipped(data.equipped || { avatar: '👤', frame: 'none', bg: '#fff' });
      } else {
        // ถ้าเป็น User ใหม่ ให้ทุนตั้งตัว 200 เหรียญ
        update(userRef, { coins: 200, inventory: [], equipped: { avatar: '👤' } });
      }
    });
  }, [username]);

  // ฟังก์ชันซื้อไอเท็ม
  const handleBuy = (item) => {
    if (coins < item.price) {
      alert("เงินไม่พอครับ! ไปเล่นเกมเก็บเงินก่อนนะ 💸");
      return;
    }
    
    const db = getDatabase();
    const userRef = ref(db, `users/${username}`);
    
    const newInventory = [...inventory, item.id];
    const newCoins = coins - item.price;

    update(userRef, {
      coins: newCoins,
      inventory: newInventory
    }).then(() => {
      alert(`ซื้อ ${item.name} สำเร็จ! 🎉`);
    });
  };

  // ฟังก์ชันกดใส่ (Equip)
  const handleEquip = (item) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${username}`);
    
    const newEquipped = { ...equipped, [item.type]: item.value };
    // ถ้าเป็น bg อาจจะต้องเก็บค่าสีแยก (ขอทำแบบง่ายก่อน)
    if(item.type === 'bg') newEquipped.bg = item.value;
    if(item.type === 'frame') newEquipped.frame = item.value;
    if(item.type === 'avatar') newEquipped.avatar = item.value;

    update(userRef, {
      equipped: newEquipped
    });
  };

  // กรองสินค้าตาม Tab
  const filteredItems = shopItems.filter(item => item.type === activeTab);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <button onClick={onBack} className="back-btn">⬅ กลับ</button>
        <h1>🛒 Item Shop</h1>
        <div className="coin-display">
          💰 {coins} Coins
        </div>
      </div>

      {/* Preview ตัวละครเรา */}
      <div className="avatar-preview-card" style={{ background: equipped.bg, border: '1px solid #ddd' }}>
        <h3>ตัวละครของคุณ</h3>
        <div className="avatar-circle" style={{ border: equipped.frame === 'none' ? '4px solid #eee' : equipped.frame }}>
          {equipped.avatar}
        </div>
        <p>{username}</p>
      </div>

      {/* Tabs เลือกหมวดหมู่ */}
      <div className="shop-tabs">
        <button className={activeTab === 'avatar' ? 'active' : ''} onClick={() => setActiveTab('avatar')}>ตัวละคร</button>
        <button className={activeTab === 'frame' ? 'active' : ''} onClick={() => setActiveTab('frame')}>กรอบรูป</button>
        <button className={activeTab === 'bg' ? 'active' : ''} onClick={() => setActiveTab('bg')}>พื้นหลัง</button>
      </div>

      {/* รายการสินค้า */}
      <div className="shop-grid">
        {filteredItems.map((item) => {
          const isOwned = inventory.includes(item.id);
          const isEquipped = equipped[item.type] === item.value;

          return (
            <div key={item.id} className={`shop-item ${isOwned ? 'owned' : ''}`}>
             <div className="item-icon" style={item.type === 'bg' ? {background: item.value, width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #ccc'} : {}}>
  
  {/* ✅ 1. ถ้าเป็น Avatar ให้โชว์ Emoji */}
  {item.type === 'avatar' && (
    <span style={{ fontSize: '40px' }}>{item.value}</span>
  )}

  {/* ✅ 2. ถ้าเป็น Frame ให้สร้างกล่องสี่เหลี่ยมมาโชว์ขอบ */}
  {item.type === 'frame' && (
    <div style={{
      width: '50px',
      height: '50px',
      borderRadius: '50%', // ให้กรอบเป็นวงกลมเหมือนตอนใส่จริง
      border: item.value.split(';')[0], // ตัด string เอาแค่ส่วน border (แก้บัคกรอบสายรุ้ง)
      boxSizing: 'border-box'
    }}></div>
  )}

</div>
              <h4>{item.name}</h4>
              
              {!isOwned ? (
                <button className="buy-btn" onClick={() => handleBuy(item)}>
                  ซื้อ 💰 {item.price}
                </button>
              ) : (
                <button className="equip-btn" disabled={isEquipped} onClick={() => handleEquip(item)}>
                  {isEquipped ? 'ใส่อยู่ ✅' : 'กดใส่ 👕'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;