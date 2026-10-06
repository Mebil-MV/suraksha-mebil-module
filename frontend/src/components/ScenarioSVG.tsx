import type { JSX } from "react";

const ScenarioSVG = ({ svgKey, size = "normal" }: { svgKey: string; size?: "normal" | "large" }) => {
  const h = size === "large" ? 280 : 200;

  const svgs: Record<string, JSX.Element> = {
    room_shaking: (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        {/* Sky */}
        <rect x="0" y="0" width="300" height="200" fill="#fef3c7" />
        {/* Ground */}
        <rect x="0" y="160" width="300" height="40" fill="#92400e" />
        {/* House walls */}
        <rect x="60" y="60" width="180" height="110" fill="#fde68a" stroke="#92400e" strokeWidth="2" rx="2" />
        {/* Roof */}
        <polygon points="50,62 150,10 250,62" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
        {/* Door */}
        <rect x="130" y="110" width="40" height="60" fill="#78350f" rx="3" />
        <circle cx="163" cy="142" r="3" fill="#fbbf24" />
        {/* Windows */}
        <rect x="80" y="85" width="35" height="30" fill="#bfdbfe" stroke="#92400e" strokeWidth="1.5" rx="2" />
        <line x1="97" y1="85" x2="97" y2="115" stroke="#92400e" strokeWidth="1" />
        <line x1="80" y1="100" x2="115" y2="100" stroke="#92400e" strokeWidth="1" />
        <rect x="185" y="85" width="35" height="30" fill="#bfdbfe" stroke="#92400e" strokeWidth="1.5" rx="2" />
        <line x1="202" y1="85" x2="202" y2="115" stroke="#92400e" strokeWidth="1" />
        <line x1="185" y1="100" x2="220" y2="100" stroke="#92400e" strokeWidth="1" />
        {/* Cracks */}
        <path d="M85 65 L90 85 L82 100 L92 120" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M210 70 L215 88 L205 105 L218 125" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M150 55 L148 40 L155 30" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Seismic waves */}
        <path d="M10 175 Q25 168 40 175 T70 175 T100 175" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.8">
          <animate attributeName="d" values="M10 175 Q25 168 40 175 T70 175 T100 175;M10 175 Q25 182 40 175 T70 175 T100 175;M10 175 Q25 168 40 175 T70 175 T100 175" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M200 175 Q215 168 230 175 T260 175 T290 175" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.8">
          <animate attributeName="d" values="M200 175 Q215 182 230 175 T260 175 T290 175;M200 175 Q215 168 230 175 T260 175 T290 175;M200 175 Q215 182 230 175 T260 175 T290 175" dur="0.5s" repeatCount="indefinite" />
        </path>
        {/* Falling debris */}
        <rect x="120" y="30" width="6" height="6" fill="#78350f" transform="rotate(25,123,33)">
          <animate attributeName="y" values="30;50;30" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="190" y="25" width="5" height="5" fill="#78350f" transform="rotate(-15,192,27)">
          <animate attributeName="y" values="25;48;25" dur="0.8s" repeatCount="indefinite" />
        </rect>
        {/* Danger sign */}
        <text x="150" y="195" textAnchor="middle" fontSize="11" fill="#fef3c7" fontWeight="bold" fontFamily="sans-serif">⚡ EARTHQUAKE ZONE ⚡</text>
      </svg>
    ),
    rising_water_street: (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        {/* Sky gradient */}
        <defs>
          <linearGradient id="floodSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="200" fill="url(#floodSky)" />
        {/* Rain */}
        {[20,50,80,110,140,170,200,230,260,285].map((x, i) => (
          <line key={i} x1={x} y1={0} x2={x-8} y2={15} stroke="#bfdbfe" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="y1" values={`${(i*13)%40};${((i*13)%40)+180};${(i*13)%40}`} dur={`${0.6+i*0.1}s`} repeatCount="indefinite" />
            <animate attributeName="y2" values={`${(i*13)%40+15};${((i*13)%40)+195};${(i*13)%40+15}`} dur={`${0.6+i*0.1}s`} repeatCount="indefinite" />
          </line>
        ))}
        {/* House 1 */}
        <rect x="40" y="55" width="55" height="60" fill="#d4a574" stroke="#92400e" strokeWidth="1.5" />
        <polygon points="35,57 67,25 100,57" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
        <rect x="55" y="75" width="15" height="20" fill="#78350f" />
        <rect x="77" y="65" width="12" height="12" fill="#bfdbfe" stroke="#92400e" strokeWidth="1" />
        {/* House 2 */}
        <rect x="180" y="65" width="50" height="50" fill="#d4a574" stroke="#92400e" strokeWidth="1.5" />
        <polygon points="175,67 205,38 235,67" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
        <rect x="197" y="80" width="14" height="20" fill="#78350f" />
        {/* Tree */}
        <rect x="138" y="70" width="8" height="45" fill="#78350f" />
        <circle cx="142" cy="58" r="20" fill="#166534" />
        <circle cx="130" cy="65" r="14" fill="#15803d" />
        <circle cx="155" cy="63" r="16" fill="#15803d" />
        {/* Animated water */}
        <path fill="url(#water)">
          <animate attributeName="d"
            values="M0,110 Q30,100 60,110 T120,110 T180,110 T240,110 T300,110 L300,200 L0,200 Z;M0,110 Q30,120 60,110 T120,110 T180,110 T240,110 T300,110 L300,200 L0,200 Z;M0,110 Q30,100 60,110 T120,110 T180,110 T240,110 T300,110 L300,200 L0,200 Z"
            dur="2s" repeatCount="indefinite" />
        </path>
        {/* Water level rising indicator */}
        <path d="M0,120 Q40,112 80,120 T160,120 T240,120 T300,120 L300,200 L0,200 Z" fill="#2563eb" opacity="0.3">
          <animate attributeName="d"
            values="M0,130 Q40,122 80,130 T160,130 T240,130 T300,130 L300,200 L0,200 Z;M0,125 Q40,132 80,125 T160,125 T240,125 T300,125 L300,200 L0,200 Z;M0,130 Q40,122 80,130 T160,130 T240,130 T300,130 L300,200 L0,200 Z"
            dur="2.5s" repeatCount="indefinite" />
        </path>
        <text x="150" y="170" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">🌊 RISING FLOOD WATERS 🌊</text>
      </svg>
    ),
    smoke_corridor: (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        {/* Corridor walls */}
        <rect x="0" y="0" width="300" height="200" fill="#1c1917" />
        {/* Floor */}
        <polygon points="0,200 300,200 250,130 50,130" fill="#44403c" />
        {/* Left wall */}
        <polygon points="0,0 50,40 50,130 0,200" fill="#78716c" />
        {/* Right wall */}
        <polygon points="300,0 250,40 250,130 300,200" fill="#78716c" />
        {/* Ceiling */}
        <polygon points="0,0 300,0 250,40 50,40" fill="#57534e" />
        {/* Back wall with door */}
        <rect x="50" y="40" width="200" height="90" fill="#a8a29e" />
        <rect x="125" y="55" width="50" height="75" fill="#78350f" />
        <circle cx="167" cy="95" r="3" fill="#fbbf24" />
        {/* Fire glow at base */}
        <rect x="50" y="120" width="200" height="10" fill="#ef4444" opacity="0.5" />
        <rect x="60" y="122" width="40" height="8" fill="#f97316" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="0.4s" repeatCount="indefinite" />
        </rect>
        <rect x="200" y="122" width="35" height="8" fill="#f97316" opacity="0.7">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.5s" repeatCount="indefinite" />
        </rect>
        {/* Animated smoke clouds */}
        <circle cx="80" cy="60" r="25" fill="#78716c" opacity="0.7">
          <animate attributeName="cx" values="80;100;80" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="25;30;25" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="55" r="30" fill="#a8a29e" opacity="0.6">
          <animate attributeName="cx" values="150;170;150" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="30;35;30" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="220" cy="58" r="22" fill="#78716c" opacity="0.7">
          <animate attributeName="cx" values="220;200;220" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="120" cy="72" r="18" fill="#a8a29e" opacity="0.5">
          <animate attributeName="cx" values="120;140;120" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="190" cy="75" r="20" fill="#78716c" opacity="0.4">
          <animate attributeName="cx" values="190;170;190" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="195" textAnchor="middle" fontSize="11" fill="#fbbf24" fontWeight="bold" fontFamily="sans-serif">🔥 FIRE — SMOKE FILLED CORRIDOR 🔥</text>
      </svg>
    ),
    dark_funnel_sky: (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        {/* Dark sky */}
        <defs>
          <linearGradient id="tornadoSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <radialGradient id="funnelGrad" cx="50%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="300" height="200" fill="url(#tornadoSky)" />
        {/* Ground */}
        <rect x="0" y="155" width="300" height="45" fill="#365314" />
        {/* Storm clouds */}
        <ellipse cx="150" cy="25" rx="120" ry="25" fill="#374151" />
        <ellipse cx="100" cy="20" rx="60" ry="20" fill="#4b5563" />
        <ellipse cx="200" cy="22" rx="70" ry="18" fill="#4b5563" />
        <ellipse cx="60" cy="30" rx="40" ry="15" fill="#374151" />
        <ellipse cx="240" cy="28" rx="45" ry="15" fill="#374151" />
        {/* Funnel */}
        <polygon points="120,30 180,30 165,155 135,155" fill="url(#funnelGrad)" opacity="0.8">
          <animate attributeName="points" values="120,30 180,30 165,155 135,155;118,30 182,30 162,155 138,155;120,30 180,30 165,155 135,155" dur="1s" repeatCount="indefinite" />
        </polygon>
        <polygon points="128,35 172,35 160,148 140,148" fill="#6b7280" opacity="0.5">
          <animate attributeName="points" values="128,35 172,35 160,148 140,148;130,35 170,35 158,148 142,148;128,35 172,35 160,148 140,148" dur="0.8s" repeatCount="indefinite" />
        </polygon>
        {/* Debris */}
        <rect x="145" y="130" width="8" height="4" fill="#78350f" transform="rotate(30,149,132)">
          <animate attributeName="transform" values="rotate(30,149,132);rotate(390,149,132)" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="155" y="100" width="5" height="3" fill="#78350f">
          <animate attributeName="transform" values="rotate(0,157,101);rotate(360,157,101)" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <circle cx="140" cy="120" r="3" fill="#92400e">
          <animate attributeName="cx" values="140;160;140" dur="1s" repeatCount="indefinite" />
        </circle>
        {/* Small house being affected */}
        <rect x="30" y="140" width="25" height="18" fill="#d4a574" />
        <polygon points="27,141 42,128 57,141" fill="#b91c1c" />
        {/* Lightning */}
        <path d="M80 15 L85 40 L78 42 L88 65" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0;0;0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </path>
        <text x="150" y="193" textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="bold" fontFamily="sans-serif">🌪️ TORNADO APPROACHING 🌪️</text>
      </svg>
    ),
    ocean_receding: (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        {/* Sky */}
        <defs>
          <linearGradient id="tsunamiSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="tsunamiWave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="200" fill="url(#tsunamiSky)" />
        {/* Sun */}
        <circle cx="250" cy="35" r="22" fill="#fbbf24" />
        <circle cx="250" cy="35" r="18" fill="#fcd34d" />
        {/* Beach */}
        <path d="M0,130 Q75,120 150,125 T300,130 L300,200 L0,200 Z" fill="#fde68a" />
        <path d="M0,140 Q60,132 120,138 T240,135 T300,140 L300,200 L0,200 Z" fill="#fcd34d" />
        {/* Palm tree */}
        <rect x="58" y="90" width="6" height="50" fill="#78350f" />
        <path d="M61 90 Q40 75 25 85" stroke="#166534" strokeWidth="4" fill="none" />
        <path d="M61 90 Q80 72 95 82" stroke="#166534" strokeWidth="4" fill="none" />
        <path d="M61 88 Q50 68 35 72" stroke="#15803d" strokeWidth="3" fill="none" />
        <path d="M61 88 Q72 66 87 70" stroke="#15803d" strokeWidth="3" fill="none" />
        {/* Receding water — exposed sea bed */}
        <rect x="0" y="150" width="300" height="50" fill="#a3e635" opacity="0.3" />
        {/* Small puddles on exposed seabed */}
        <ellipse cx="100" cy="165" rx="12" ry="4" fill="#38bdf8" opacity="0.5" />
        <ellipse cx="200" cy="160" rx="8" ry="3" fill="#38bdf8" opacity="0.4" />
        <ellipse cx="260" cy="170" rx="10" ry="3" fill="#38bdf8" opacity="0.5" />
        {/* Distant huge wave building */}
        <path d="M-10,115 Q50,85 100,100 T200,90 T310,105 L310,130 L-10,130 Z" fill="url(#tsunamiWave)" opacity="0.6">
          <animate attributeName="d" values="M-10,115 Q50,85 100,100 T200,90 T310,105 L310,130 L-10,130 Z;M-10,110 Q50,80 100,95 T200,85 T310,100 L310,130 L-10,130 Z;M-10,115 Q50,85 100,100 T200,90 T310,105 L310,130 L-10,130 Z" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Warning arrows */}
        <text x="185" y="155" fontSize="10" fill="#dc2626" fontWeight="bold" fontFamily="sans-serif">← WATER RECEDING →</text>
        {/* Danger warning */}
        <polygon points="150,132 158,146 142,146" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        <text x="150" y="144" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">!</text>
        <text x="150" y="195" textAnchor="middle" fontSize="11" fill="#1e3a5f" fontWeight="bold" fontFamily="sans-serif">🌊 TSUNAMI WARNING — OCEAN RECEDING 🌊</text>
      </svg>
    ),
  };

  return (
    svgs[svgKey] || (
      <svg viewBox="0 0 300 200" width="100%" style={{ maxHeight: h }}>
        <rect x="0" y="0" width="300" height="200" fill="#fef3c7" />
        <polygon points="150,30 230,160 70,160" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
        <text x="150" y="125" textAnchor="middle" fontSize="50" fill="white" fontWeight="bold">!</text>
        <text x="150" y="185" textAnchor="middle" fontSize="13" fill="#92400e" fontWeight="bold" fontFamily="sans-serif">⚠️ DISASTER SCENARIO ⚠️</text>
      </svg>
    )
  );
};

export default ScenarioSVG;
