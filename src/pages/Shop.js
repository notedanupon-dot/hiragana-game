import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { shopItems } from '../data/shopItems';
import '../Shop.css';

// ✅ 1. ฟังก์ชันช่วยแปลงสไตล์กรอบรูป (รองรับ Neon & Rainbow)
const getFrameStyle = (frameType) => {
  if (!frameType || frameType === 'none') {
    return { border: '4px solid #eee' }; // กรอบ Default เวลาไม่มีของ
  }

  // 🌈 กรอบสายรุ้ง
  if (frameType === 'rainbow') {
    return {
      border: '5px solid transparent',
      backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      borderRadius: '50%'
    };
  }

  // 💡 กรอบนีออน
  if (frameType === 'neon') {
    return {
      border: '4px solid #fff',
      boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
      borderRadius: '50%'
    };
  }

  // กรอบปกติ (เช่น '5px solid gold')
  return {
    border: frameType,
    borderRadius: '50%'
  };
};

const Shop = ({ username, onBack }) => {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]); 
  const [equipped, setEquipped] = useState({ avatar: '👤', frame: 'none', bg: '#fff' });
  const [activeTab, setActiveTab] = useState('avatar'); 

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
    
    if(item.type === 'bg') newEquipped.bg = item.value;
    if(item.type === 'frame') newEquipped.frame = item.value;
    if(item.type === 'avatar') newEquipped.avatar = item.value;

    update(userRef, {
      equipped: newEquipped
    });
  };

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

      {/* ✅ 2. แก้ไข Preview ตัวละครด้านบน ให้ใช้ getFrameStyle */}
      <div className="avatar-preview-card" style={{ background: equipped.bg, border: '1px solid #ddd' }}>
        <h3>ตัวละครของคุณ</h3>
        
        <div className="avatar-circle" style={{ position: 'relative', overflow: 'visible', border: 'none' }}>
           {/* Layer กรอบรูป */}
           <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              ...getFrameStyle(equipped.frame), // เรียกใช้ฟังก์ชันตรงนี้
              pointerEvents: 'none',
              zIndex: 2
           }}></div>

           {/* Layer รูป Avatar */}
           <div style={{ 
              width: '100%', height: '100%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '50px' 
           }}>
             {equipped.avatar}
           </div>
        </div>
        
        <p>{username}</p>
      </div>

      <div className="shop-tabs">
        <button className={activeTab === 'avatar' ? 'active' : ''} onClick={() => setActiveTab('avatar')}>ตัวละคร</button>
        <button className={activeTab === 'frame' ? 'active' : ''} onClick={() => setActiveTab('frame')}>กรอบรูป</button>
        <button className={activeTab === 'bg' ? 'active' : ''} onClick={() => setActiveTab('bg')}>พื้นหลัง</button>
      </div>

      <div className="shop-grid">
        {filteredItems.map((item) => {
          const isOwned = inventory.includes(item.id);
          const isEquipped = equipped[item.type] === item.value;

          return (
            <div key={item.id} className={`shop-item ${isOwned ? 'owned' : ''}`}>
              
              <div className="item-icon" style={{
                  width: '60px', 
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  position: 'relative', // สำคัญสำหรับการจัดวาง Layer
                  ...(item.type === 'bg' ? { background: item.value, border: '1px solid #ddd' } : {})
              }}>
                
                {item.type === 'avatar' && <span style={{ fontSize: '40px' }}>{item.value}</span>}

                {/* ✅ 3. แก้ไขการแสดงผลสินค้าประเภท Frame ให้ใช้ getFrameStyle */}
                {item.type === 'frame' && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    ...getFrameStyle(item.value), // เรียกใช้ฟังก์ชันตรงนี้
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