import React, { useRef, useState, useEffect } from 'react';

const DrawModal = ({ targetChar, targetRomaji, onClose, onCorrect }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ตั้งค่า Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 12; // เพิ่มความหนาเส้นปากกาให้เห็นชัดขึ้นเมื่อเทียบกับตัวเฉลย
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#333'; // สีปากกา (ดำเข้ม)
      
      // ⚠️ สำคัญ: ไม่เทสีขาวพื้นหลัง เพื่อให้มองทะลุเห็นตัวเฉลยด้านหลังได้
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (event) => {
    if (event.touches && event.touches[0]) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>วาดตัวอักษร: <span style={{color: '#9C27B0', fontSize: '1.2em'}}>{targetRomaji.toUpperCase()}</span></h3>
        
        {/* Container พื้นที่วาดรูป */}
        <div style={{
          position: 'relative', 
          width: '300px', 
          height: '300px', 
          margin: '0 auto', 
          border: '2px solid #ccc', 
          borderRadius: '15px', 
          background: 'white', // พื้นหลังสีขาวอยู่ที่ Container แทน Canvas
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}>
          
          {/* ✅ LAYER 1: เฉลย (อยู่ด้านหลัง) */}
          {showAnswer && (
            <div style={{
              position: 'absolute', 
              top: 0, left: 0, 
              width: '100%', height: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '220px', 
              fontFamily: '"Noto Sans JP", "Hiragino Kaku Gothic Pro", sans-serif',
              color: '#e0e0e0', // สีเทาจางๆ (เหมือนลายน้ำ/เส้นร่าง)
              pointerEvents: 'none', // ให้คลิกทะลุไปวาดบน Canvas ได้
              zIndex: 1, // อยู่ชั้นล่าง
              userSelect: 'none'
            }}>
              {targetChar}
            </div>
          )}
          
          {/* ✅ LAYER 2: เส้นที่วาด (อยู่ด้านหน้า) */}
          <canvas
            ref={canvasRef}
            style={{ 
              position: 'absolute',
              top: 0, left: 0,
              touchAction: 'none', 
              background: 'transparent', // พื้นหลังใส มองทะลุไปเห็นเฉลย
              zIndex: 2 // อยู่ชั้นบน
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="modal-actions" style={{marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center'}}>
          {!showAnswer ? (
             <>
               <button onClick={clearCanvas} style={{background: '#ff9800', display: 'flex', alignItems: 'center', gap: '5px'}}>
                 🧹 ลบใหม่
               </button>
               <button onClick={() => setShowAnswer(true)} style={{background: '#2196F3', display: 'flex', alignItems: 'center', gap: '5px'}}>
                 👁️ เฉลย / ตรวจคำตอบ
               </button>
             </>
          ) : (
             <>
               <button onClick={onClose} style={{background: '#f44336'}}>
                 ❌ ยังไม่เหมือน (ฝึกใหม่)
               </button>
               <button onClick={onCorrect} style={{background: '#4CAF50', transform: 'scale(1.1)', boxShadow: '0 4px 10px rgba(76, 175, 80, 0.4)'}}>
                 ✅ ถูกต้อง! (เหมือนเป๊ะ)
               </button>
             </>
          )}
        </div>
        
        <button onClick={onClose} className="close-x-btn">✕</button>
      </div>
    </div>
  );
};

export default DrawModal;