import { useEffect, useState } from 'react';

const ZONES = [
  { name: 'IDENTITY', label: 'Identity', progress: 0.05 },
  { name: 'INTERESTS', label: 'Interests', progress: 0.21 },
  { name: 'PROJECTS', label: 'Projects', progress: 0.38 },
  { name: 'SKILLS', label: 'Skills', progress: 0.55 },
  { name: 'JOURNEY', label: 'Journey', progress: 0.70 },
  { name: 'VISION', label: 'Vision', progress: 0.84 },
  { name: 'CONTACT', label: 'Contact', progress: 0.98 },
];

export default function HUD({ scrollProgress }) {
  const [localTime, setLocalTime] = useState('');

  // Calculate active zone directly from scroll progress without re-render loop
  let currentZoneIndex = 0;
  if (scrollProgress >= 0.90) currentZoneIndex = 6;
  else if (scrollProgress >= 0.78) currentZoneIndex = 5;
  else if (scrollProgress >= 0.62) currentZoneIndex = 4;
  else if (scrollProgress >= 0.48) currentZoneIndex = 3;
  else if (scrollProgress >= 0.28) currentZoneIndex = 2;
  else if (scrollProgress >= 0.14) currentZoneIndex = 1;

  // Update clock in bottom-right corner
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setLocalTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (progress) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="hud-layer">
      {/* Top Header */}
      <div className="interactive" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', pointerEvents: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '2px', color: '#fff' }}>
          PROFILE-OS <span style={{ color: 'var(--accent)', fontSize: '0.8rem', verticalAlign: 'super' }}>V1.0</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
          SECURE UPLINK STATUS: SECURE // OPERATOR_ID: MSK
        </div>
      </div>

      {/* Side Dot navigation */}
      <div className="hud-nav interactive">
        {ZONES.map((zone, idx) => (
          <div
            key={idx}
            className={`hud-dot ${currentZoneIndex === idx ? 'active' : ''}`}
            onClick={() => handleDotClick(zone.progress)}
            title={zone.label}
          />
        ))}
      </div>

      {/* Bottom Footer Info */}
      <div className="interactive" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', pointerEvents: 'auto', zIndex: 30 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          ZONE // <span style={{ color: '#fff', fontWeight: 'bold' }}>{ZONES[currentZoneIndex].name}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
          MISSION_TIME: {localTime} LST
        </div>
      </div>
    </div>
  );
}
