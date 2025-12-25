import React, { useRef, useState, useEffect } from 'react';

const DrawModal = ({ targetChar, targetRomaji, onClose, onCorrect }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // ตั้งค่า Canvas เมื่อเปิดขึ้นมา
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#333';
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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

  // ฟังก์ชันแปลงพิกัด (รองรับทั้ง Mouse และ Touch)
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
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>วาดตัวอักษร: <span style={{color: '#9C27B0'}}>{targetRomaji.toUpperCase()}</span></h3>
        
        <div style={{position: 'relative', width: '300px', height: '300px', margin: '0 auto', border: '2px solid #ccc', borderRadius: '10px', overflow: 'hidden'}}>
          {/* เฉลย (ซ่อนอยู่หลัง Canvas) */}
          {showAnswer && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '200px', color: 'rgba(0, 255, 0, 0.3)', pointerEvents: 'none', userSelect: 'none'
            }}>
              {targetChar}
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            style={{ touchAction: 'none', background: 'transparent', position: 'relative', zIndex: 2 }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="modal-actions" style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center'}}>
          {!showAnswer ? (
             <>
               <button onClick={clearCanvas} style={{background: '#ff9800'}}>🧹 ลบ</button>
               <button onClick={() => setShowAnswer(true)} style={{background: '#2196F3'}}>👁️ เฉลย</button>
             </>
          ) : (
             <>
               <button onClick={onClose} style={{background: '#f44336'}}>❌ ผิด (ฝึกใหม่)</button>
               <button onClick={onCorrect} style={{background: '#4CAF50'}}>✅ ถูกต้อง!</button>
             </>
          )}
        </div>
        
        <button onClick={onClose} className="close-x-btn">✕</button>
      </div>
    </div>
  );
};

export default DrawModal;