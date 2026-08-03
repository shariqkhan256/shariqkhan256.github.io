import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef(null);

  const bootText = [
    "Establishing secure orbital uplink...",
    "Loading PROFILE-OS v1.0.0 [Identity Core]...",
    "Decrypting core verification database...",
    "Reassembling narrative and structured logs...",
    "Synchronizing telemetry with Namal Mission Control...",
    "Connection stable. Authentication: VERIFIED.",
    "System status: ONLINE. All missions ready."
  ];

  useEffect(() => {
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < bootText.length) {
        setLines((prev) => [...prev, bootText[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.8,
      onComplete: onComplete,
      ease: "power2.inOut"
    });
  };

  return (
    <div ref={containerRef} className="boot-overlay">
      <div className="boot-terminal">
        {lines.map((line, idx) => (
          <div key={idx} className="boot-line">
            <span style={{ color: '#00a8ff' }}>&gt; </span>
            {line}
          </div>
        ))}
        {!showButton && (
          <div>
            <span style={{ color: '#00a8ff' }}>&gt; </span>
            <span className="cursor"></span>
          </div>
        )}
        {showButton && (
          <div className="boot-line" style={{ marginTop: '40px', animationDelay: '0.2s' }}>
            <span style={{ color: '#00e5ff' }}>&gt; </span>
            <button 
              onClick={handleStart}
              className="comm-btn interactive"
              style={{ display: 'inline-flex', cursor: 'pointer', marginTop: '10px' }}
            >
              INITIALIZE MISSION CONTROL <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
