import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update } from 'firebase/database';
// อย่าลืมเช็คว่า path นี้ตรงกับไฟล์ของคุณ
import { shopItems } from '../data/shopItems'; 
import '../Shop.css';

// ✅ ฟังก์ชันช่วยแปลงสไตล์กรอบรูป (ปรับปรุงใหม่)
const getFrameStyle = (frameType) => {
  if (!frameType || frameType === 'none') {
    return { border: '4px solid #eee' };
  }

  // 🌈 กรอบสายรุ้ง (แบบใหม่: ตรงกลางโปร่งใส ไม่บังหน้า)
  if (frameType === 'rainbow') {
    return {
      border: '4px solid transparent', // ใช้ขอบใสเป็นฐาน
      borderRadius: '50%',
      // ใช้ Linear Gradient ซ้อนกันเพื่อทำขอบรุ้ง
      background: `
        linear-gradient(#fff, #fff) padding-box, 
        linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) border-box
      `,
      // เทคนิคนี้จะเจาะรูตรงกลางให้โปร่ง (ใช้ได้ใน Chrome/Safari/Edge รุ่นใหม่)
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude'
    };
  }

  // 💡 กรอบนีออน
  if (frameType === 'neon') {
    return {
      border: '4px solid #fff',
      boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF', // แสงฟุ้ง
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

  const handleEquip = (item) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${username}`);
    
    const newEquipped = { ...equipped, [item.type]: item.value };
    
    // Logic แยกประเภท
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

      {/* ✅ Preview ตัวละคร (ด้านบน) */}
      <div className="avatar-preview-card" style={{ background: equipped.bg, border: '1px solid #ddd' }}>
        <h3>ตัวละครของคุณ</h3>
        
        <div className="avatar-circle" style={{ position: 'relative', overflow: 'visible', border: 'none' }}>
           
           {/* Layer กรอบรูป (อยู่ด้านบนสุด zIndex: 2) */}
           <div style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              ...getFrameStyle(equipped.frame), 
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
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                  position: 'relative',
                  ...(item.type === 'bg' ? { background: item.value, border: '1px solid #ddd' } : {})
              }}>
                
                {item.type === 'avatar' && <span style={{ fontSize: '40px' }}>{item.value}</span>}

                {/* ✅ ส่วนแสดงกรอบในรายการสินค้า */}
                {item.type === 'frame' && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    ...getFrameStyle(item.value), 
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