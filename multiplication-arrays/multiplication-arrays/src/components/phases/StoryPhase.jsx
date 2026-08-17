import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio.js';
import { say, emphasize, ask, cheer } from '../../utils/audio.js';

// Per-panel narration segments — Western context
const PANEL_NARRATION = [
  [ say("Ryan is a second grade student at Maplewood Elementary School."),
    say("One morning, his teacher Ms. Parker asked for a volunteer to help set up the gym for the school assembly.") ],
  [ say("Ms. Parker said: Ryan, please make 4 rows of chairs, with 5 chairs in each row."),
    say("Ryan started placing them one by one.") ],
  [ say("When Ryan finished, he stepped back and saw the chairs formed a perfect rectangle."),
    emphasize("Rows going across, columns going down — an ARRAY!") ],
  [ say("Ms. Parker pointed at the board. Rows go ACROSS. Columns go DOWN."),
    emphasize("Your array has 4 rows and 5 columns!") ],
  [ say("Ms. Parker wrote on the whiteboard: 4 times 5 equals 20."),
    cheer("This is a multiplication sentence! 4 rows of 5 equals 20 — no counting one by one!") ],
  [ cheer("Now YOU will build arrays, find missing numbers, and write multiplication sentences — just like Ryan."),
    emphasize("Rows times Columns equals Total. Let us go!") ],
];

// ─── HD Singapore-school cartoon scene illustrations ───────────────────────
// Each scene is a rich SVG painting with characters, backgrounds, and colour

function Scene1() {
  // Ryan at school gate — morning, Singapore primary school
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      {/* Sky */}
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB"/>
          <stop offset="100%" stopColor="#E0F4FF"/>
        </linearGradient>
        <linearGradient id="ground1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="100%" stopColor="#388E3C"/>
        </linearGradient>
      </defs>
      <rect width="500" height="240" fill="url(#sky1)"/>
      {/* Sun */}
      <circle cx="440" cy="38" r="28" fill="#FFD600" opacity="0.9"/>
      <circle cx="440" cy="38" r="22" fill="#FFEB3B"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <line key={i} x1="440" y1="38"
          x2={440+Math.cos(a*Math.PI/180)*38} y2={38+Math.sin(a*Math.PI/180)*38}
          stroke="#FFD600" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      ))}
      {/* Clouds */}
      <ellipse cx="80" cy="35" rx="38" ry="14" fill="white" opacity="0.85"/>
      <ellipse cx="110" cy="28" rx="26" ry="16" fill="white" opacity="0.9"/>
      <ellipse cx="60" cy="30" rx="22" ry="13" fill="white" opacity="0.8"/>
      <ellipse cx="300" cy="25" rx="30" ry="11" fill="white" opacity="0.7"/>
      <ellipse cx="325" cy="19" rx="20" ry="13" fill="white" opacity="0.75"/>
      {/* School building */}
      <rect x="120" y="60" width="260" height="120" rx="6" fill="#F5F5F5" stroke="#BDBDBD" strokeWidth="2"/>
      <rect x="120" y="50" width="260" height="20" rx="4" fill="#1565C0"/>
      <text x="250" y="64" textAnchor="middle" fill="white" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">MAPLEWOOD ELEMENTARY</text>
      {/* Windows */}
      {[150,210,270,330].map((x,i)=>(
        <g key={i}>
          <rect x={x} y="80" width="36" height="34" rx="4" fill="#90CAF9" stroke="#1565C0" strokeWidth="1.5"/>
          <line x1={x+18} y1="80" x2={x+18} y2="114" stroke="#1565C0" strokeWidth="1" opacity="0.5"/>
          <line x1={x} y1="97" x2={x+36} y2="97" stroke="#1565C0" strokeWidth="1" opacity="0.5"/>
        </g>
      ))}
      {/* Door */}
      <rect x="220" y="120" width="60" height="60" rx="4" fill="#8D6E63" stroke="#5D4037" strokeWidth="2"/>
      <circle cx="274" cy="151" r="4" fill="#FFD600"/>
      {/* Ground */}
      <rect x="0" y="175" width="500" height="65" fill="url(#ground1)"/>
      <rect x="0" y="170" width="500" height="10" fill="#C8E6C9"/>
      {/* Path */}
      <ellipse cx="250" cy="210" rx="60" ry="12" fill="#D7CCC8" opacity="0.7"/>
      {/* Student (Ryan) — blue uniform, dark hair */}
      <g transform="translate(230,130)">
        {/* Body */}
        <rect x="-12" y="18" width="24" height="28" rx="4" fill="#1565C0"/>
        {/* Head */}
        <circle cx="0" cy="10" r="15" fill="#FFCC80"/>
        {/* Hair */}
        <ellipse cx="0" cy="-2" rx="15" ry="8" fill="#212121"/>
        {/* Face */}
        <circle cx="-5" cy="11" r="2" fill="#424242"/>
        <circle cx="5" cy="11" r="2" fill="#424242"/>
        <path d="M-5 17 Q0 21 5 17" stroke="#424242" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Schoolbag */}
        <rect x="12" y="20" width="14" height="18" rx="3" fill="#F57F17"/>
        {/* Legs */}
        <rect x="-10" y="46" width="9" height="20" rx="3" fill="#1565C0"/>
        <rect x="1" y="46" width="9" height="20" rx="3" fill="#1565C0"/>
        {/* Shoes */}
        <ellipse cx="-5" cy="66" rx="6" ry="4" fill="#212121"/>
        <ellipse cx="6" cy="66" rx="6" ry="4" fill="#212121"/>
        {/* Arm wave */}
        <line x1="-12" y1="28" x2="-28" y2="16" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round"/>
      </g>
      {/* Flag */}
      <line x1="400" y1="50" x2="400" y2="120" stroke="#9E9E9E" strokeWidth="3"/>
      <rect x="400" y="50" width="44" height="28" rx="2" fill="#FF1744"/>
      <circle cx="414" cy="64" r="7" fill="white"/>
      <path d="M422 58 L426 64 L422 70 Z" fill="white"/>
      {/* Label */}
      <rect x="110" y="194" width="280" height="22" rx="8" fill="rgba(21,101,192,0.18)"/>
      <text x="250" y="209" textAnchor="middle" fill="#1565C0" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">🏫 Maplewood Elementary School</text>
    </svg>
  );
}

function Scene2() {
  // Hall with rows of chairs being placed
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="hall2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8EAF6"/>
          <stop offset="100%" stopColor="#C5CAE9"/>
        </linearGradient>
      </defs>
      <rect width="500" height="240" fill="url(#hall2)"/>
      {/* Floor */}
      <rect x="0" y="175" width="500" height="65" fill="#BCAAA4"/>
      {/* Floor tiles */}
      {[0,1,2,3,4].map(i=>[0,1,2].map(j=>(
        <rect key={`${i}${j}`} x={i*100} y={175+j*22} width="100" height="22" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
      )))}
      {/* Back wall stage */}
      <rect x="150" y="30" width="200" height="100" rx="4" fill="#7986CB" opacity="0.3"/>
      <rect x="155" y="35" width="190" height="90" rx="2" fill="#5C6BC0" opacity="0.2"/>
      <text x="250" y="88" textAnchor="middle" fill="#283593" fontSize="13" fontFamily="Fredoka One,sans-serif" fontWeight="900">SCHOOL GYM</text>
      {/* 4 rows of 5 chairs */}
      {[0,1,2,3].map(row=>[0,1,2,3,4].map(col=>(
        <g key={`${row}-${col}`} transform={`translate(${95+col*58},${110+row*14})`}>
          <rect x="-10" y="0" width="20" height="14" rx="3" fill="#F57F17" stroke="#E65100" strokeWidth="1"/>
          <rect x="-8" y="14" width="16" height="3" rx="1" fill="#BF360C"/>
          <rect x="-12" y="15" width="4" height="8" rx="1" fill="#6D4C41"/>
          <rect x="8" y="15" width="4" height="8" rx="1" fill="#6D4C41"/>
        </g>
      )))}
      {/* Row/column labels */}
      <text x="72" y="128" fill="#1565C0" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900">Row 1</text>
      <text x="72" y="142" fill="#1565C0" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900">Row 2</text>
      <text x="72" y="156" fill="#1565C0" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900">Row 3</text>
      <text x="72" y="170" fill="#1565C0" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900">Row 4</text>
      {/* Ryan carrying chair */}
      <g transform="translate(430,120)">
        <rect x="-12" y="18" width="24" height="28" rx="4" fill="#1565C0"/>
        <circle cx="0" cy="10" r="14" fill="#FFCC80"/>
        <ellipse cx="0" cy="-1" rx="14" ry="8" fill="#212121"/>
        <circle cx="-5" cy="11" r="2" fill="#424242"/>
        <circle cx="5" cy="11" r="2" fill="#424242"/>
        <path d="M-4 17 Q0 21 4 17" stroke="#424242" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <rect x="-10" y="46" width="9" height="18" rx="3" fill="#1565C0"/>
        <rect x="1" y="46" width="9" height="18" rx="3" fill="#1565C0"/>
        {/* Chair in arms */}
        <rect x="-22" y="20" width="16" height="12" rx="2" fill="#F57F17" stroke="#E65100" strokeWidth="1"/>
        <line x1="-12" y1="28" x2="-22" y2="22" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round"/>
      </g>
      {/* Callout */}
      <rect x="10" y="8" width="180" height="28" rx="10" fill="#1565C0"/>
      <text x="100" y="27" textAnchor="middle" fill="white" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">🪑 4 rows × 5 chairs = ?</text>
    </svg>
  );
}

function Scene3() {
  // Array reveal moment — chairs in perfect grid, Ryan surprised
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="hall3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3E5F5"/>
          <stop offset="100%" stopColor="#E1BEE7"/>
        </linearGradient>
      </defs>
      <rect width="500" height="240" fill="url(#hall3)"/>
      {/* Grid highlight background */}
      <rect x="80" y="72" width="280" height="112" rx="12" fill="rgba(255,193,7,0.12)" stroke="#FFC107" strokeWidth="2" strokeDasharray="6,3"/>
      {/* 4×5 chair grid */}
      {[0,1,2,3].map(row=>[0,1,2,3,4].map(col=>(
        <g key={`${row}-${col}`} transform={`translate(${100+col*52},${84+row*24})`}>
          <rect x="-10" y="0" width="20" height="14" rx="3" fill={row===0?'#FF7043':col===0?'#42A5F5':'#F57F17'} stroke="#E65100" strokeWidth="1"/>
          <rect x="-12" y="14" width="24" height="3" rx="1" fill="#BF360C" opacity="0.6"/>
          <rect x="-10" y="15" width="3" height="7" rx="1" fill="#6D4C41"/>
          <rect x="7" y="15" width="3" height="7" rx="1" fill="#6D4C41"/>
        </g>
      )))}
      {/* ARRAY text overlay */}
      <rect x="155" y="195" width="190" height="28" rx="10" fill="#7B1FA2"/>
      <text x="250" y="214" textAnchor="middle" fill="white" fontSize="13" fontFamily="Fredoka One,sans-serif" fontWeight="900">✨ It's an ARRAY! ✨</text>
      {/* Row arrow */}
      <line x1="84" y1="90" x2="78" y2="164" stroke="#FF7043" strokeWidth="2.5" strokeDasharray="4,2" markerEnd="url(#arr)"/>
      <text x="52" y="130" fill="#FF7043" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900" textAnchor="middle">4 rows↕</text>
      {/* Col arrow */}
      <line x1="96" y1="72" x2="356" y2="66" stroke="#42A5F5" strokeWidth="2.5" strokeDasharray="4,2"/>
      <text x="250" y="62" fill="#42A5F5" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900" textAnchor="middle">5 columns →</text>
      {/* Ryan surprised */}
      <g transform="translate(430,140)">
        <rect x="-12" y="18" width="24" height="28" rx="4" fill="#1565C0"/>
        <circle cx="0" cy="10" r="14" fill="#FFCC80"/>
        <ellipse cx="0" cy="-1" rx="14" ry="8" fill="#212121"/>
        <circle cx="-5" cy="10" r="3" fill="#424242"/>
        <circle cx="5" cy="10" r="3" fill="#424242"/>
        {/* Surprised mouth */}
        <ellipse cx="0" cy="18" rx="4" ry="5" fill="#424242"/>
        <rect x="-10" y="46" width="9" height="18" rx="3" fill="#1565C0"/>
        <rect x="1" y="46" width="9" height="18" rx="3" fill="#1565C0"/>
        {/* Exclamation */}
        <text x="18" y="5" fill="#FFC107" fontSize="22" fontFamily="Fredoka One,sans-serif" fontWeight="900">!</text>
      </g>
    </svg>
  );
}

function Scene4() {
  // Teacher at whiteboard showing rows × columns with annotations
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="cls4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD"/>
          <stop offset="100%" stopColor="#BBDEFB"/>
        </linearGradient>
      </defs>
      <rect width="500" height="240" fill="url(#cls4)"/>
      {/* Floor */}
      <rect x="0" y="188" width="500" height="52" fill="#D7CCC8"/>
      {/* Whiteboard */}
      <rect x="60" y="28" width="290" height="150" rx="8" fill="#fff" stroke="#90A4AE" strokeWidth="3"/>
      <rect x="65" y="33" width="280" height="140" rx="4" fill="#FAFAFA"/>
      {/* Board content: 4 rows × 5 columns of dots */}
      {[0,1,2,3].map(r=>[0,1,2,3,4].map(c=>(
        <circle key={`${r}-${c}`}
          cx={105+c*44} cy={55+r*26} r="8"
          fill={r===0?'#FF7043':c===0?'#42A5F5':'#7E57C2'}
          stroke="white" strokeWidth="1.5"/>
      )))}
      {/* Formula */}
      <rect x="80" y="165" width="260" height="26" rx="8" fill="#1565C0"/>
      <text x="210" y="183" textAnchor="middle" fill="white" fontSize="14" fontFamily="Fredoka One,sans-serif" fontWeight="900">4 × 5 = 20 ✓</text>
      {/* Row brace */}
      <text x="76" y="86" fill="#FF7043" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900" textAnchor="middle">4↕</text>
      {/* Col brace */}
      <text x="210" y="50" fill="#42A5F5" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900" textAnchor="middle">5 →</text>
      {/* Teacher */}
      <g transform="translate(400,90)">
        {/* Dress/sari */}
        <rect x="-14" y="20" width="28" height="36" rx="5" fill="#E91E63"/>
        <circle cx="0" cy="10" r="16" fill="#FFCC80"/>
        {/* Hair bun */}
        <ellipse cx="0" cy="-4" rx="16" ry="8" fill="#212121"/>
        <circle cx="10" cy="-8" r="5" fill="#212121"/>
        {/* Face */}
        <circle cx="-6" cy="10" r="2.5" fill="#5D4037"/>
        <circle cx="6" cy="10" r="2.5" fill="#5D4037"/>
        <path d="M-5 17 Q0 22 5 17" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Arm pointing at board */}
        <line x1="-14" y1="28" x2="-38" y2="14" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round"/>
        <rect x="-10" y="56" width="9" height="20" rx="3" fill="#E91E63"/>
        <rect x="1" y="56" width="9" height="20" rx="3" fill="#E91E63"/>
      </g>
      {/* Caption */}
      <text x="250" y="218" textAnchor="middle" fill="#1565C0" fontSize="10" fontFamily="Fredoka One,sans-serif" fontWeight="900">
        Rows go ACROSS · Columns go DOWN
      </text>
    </svg>
  );
}

function Scene5() {
  // Multiplication sentence on board — abstract step
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="abs5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F5E9"/>
          <stop offset="100%" stopColor="#C8E6C9"/>
        </linearGradient>
      </defs>
      <rect width="500" height="240" fill="url(#abs5)"/>
      {/* Central big equation */}
      <rect x="80" y="55" width="340" height="100" rx="18" fill="#1A237E" opacity="0.92"/>
      <rect x="86" y="61" width="328" height="88" rx="14" fill="#283593" opacity="0.7"/>
      <text x="250" y="118" textAnchor="middle" fill="#FFD600" fontSize="clamp(28px,7vw,46px)" fontFamily="Fredoka One,sans-serif" fontWeight="900">4 × 5 = 20</text>
      {/* Labels */}
      <text x="138" y="52" textAnchor="middle" fill="#FF7043" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">rows</text>
      <text x="250" y="52" textAnchor="middle" fill="#90A4AE" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">×</text>
      <text x="362" y="52" textAnchor="middle" fill="#42A5F5" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">columns</text>
      {/* Arrows pointing to equation parts */}
      <line x1="138" y1="55" x2="150" y2="96" stroke="#FF7043" strokeWidth="1.5" strokeDasharray="3,2" markerEnd="url(#a1)"/>
      <line x1="362" y1="55" x2="350" y2="96" stroke="#42A5F5" strokeWidth="1.5" strokeDasharray="3,2"/>
      {/* Bottom row of chairs */}
      {[0,1,2,3,4,5,6,7,8,9].map((i)=>(
        <g key={i} transform={`translate(${55+i*42},174)`}>
          <rect x="-10" y="0" width="20" height="14" rx="3" fill="#F57F17" stroke="#E65100" strokeWidth="1"/>
          <rect x="-10" y="14" width="3" height="7" rx="1" fill="#6D4C41"/>
          <rect x="7" y="14" width="3" height="7" rx="1" fill="#6D4C41"/>
        </g>
      ))}
      {/* Groups annotation */}
      <rect x="55" y="196" width="180" height="18" rx="6" fill="rgba(255,87,34,0.2)" stroke="#FF7043" strokeWidth="1"/>
      <text x="145" y="209" textAnchor="middle" fill="#FF7043" fontSize="9" fontFamily="Fredoka One,sans-serif" fontWeight="900">10 chairs (first 2 rows shown)</text>
      {/* Key message */}
      <rect x="120" y="218" width="260" height="20" rx="8" fill="#388E3C"/>
      <text x="250" y="232" textAnchor="middle" fill="white" fontSize="10" fontFamily="Fredoka One,sans-serif" fontWeight="900">Rows × Columns = Total! 🎉</text>
    </svg>
  );
}

function Scene6() {
  // Ryan happy, Your turn! with array teaser
  return (
    <svg viewBox="0 0 500 240" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
      <defs>
        <radialGradient id="bg6" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#1A237E"/>
        </radialGradient>
      </defs>
      <rect width="500" height="240" fill="url(#bg6)"/>
      {/* Stars */}
      {[[60,40],[180,25],[310,18],[420,35],[480,80],[30,120],[470,150]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} fontSize={i%2===0?18:12} fill="#FFD600" opacity="0.7">★</text>
      ))}
      {/* 3×4 sample array */}
      <rect x="30" y="58" width="160" height="120" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,193,7,0.4)" strokeWidth="2"/>
      {[0,1,2].map(r=>[0,1,2,3].map(c=>(
        <g key={`${r}-${c}`} transform={`translate(${58+c*32},${82+r*30})`}>
          <circle cx="0" cy="0" r="10" fill="#FFC107" stroke="#FF8F00" strokeWidth="1.5"/>
          <text x="0" y="5" textAnchor="middle" fontSize="10" fill="#5D4037">⭐</text>
        </g>
      )))}
      <text x="110" y="192" textAnchor="middle" fill="#FFD600" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">3 × 4 = 12</text>
      {/* Big text */}
      <text x="310" y="85" textAnchor="middle" fill="white" fontSize="26" fontFamily="Fredoka One,sans-serif" fontWeight="900">Your turn!</text>
      <text x="310" y="115" textAnchor="middle" fill="#FFD600" fontSize="20" fontFamily="Fredoka One,sans-serif" fontWeight="900">Build Arrays!</text>
      {/* Ryan celebrating */}
      <g transform="translate(310,162)">
        <rect x="-14" y="18" width="28" height="30" rx="5" fill="#1565C0"/>
        <circle cx="0" cy="10" r="15" fill="#FFCC80"/>
        <ellipse cx="0" cy="-1" rx="15" ry="8" fill="#212121"/>
        <circle cx="-6" cy="12" r="2.5" fill="#424242"/>
        <circle cx="6" cy="12" r="2.5" fill="#424242"/>
        <path d="M-6 18 Q0 23 6 18" stroke="#424242" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Both arms up */}
        <line x1="-14" y1="26" x2="-30" y2="12" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round"/>
        <line x1="14" y1="26" x2="30" y2="12" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round"/>
        <rect x="-10" y="48" width="9" height="18" rx="3" fill="#1565C0"/>
        <rect x="1" y="48" width="9" height="18" rx="3" fill="#1565C0"/>
      </g>
      {/* Bottom banner */}
      <rect x="0" y="218" width="500" height="22" fill="rgba(255,193,7,0.15)"/>
      <text x="250" y="233" textAnchor="middle" fill="#FFD600" fontSize="11" fontFamily="Fredoka One,sans-serif" fontWeight="900">🚀 Ready to multiply? Let's go! 🚀</text>
    </svg>
  );
}

const PANELS = [
  {
    id: 1,
    image: 'story_panel1',
    title: "Ryan's Big Day",
    text: "Ryan is a second grade student at Maplewood Elementary School. One morning, his teacher Ms. Parker asked for a volunteer to help set up the gym for the school assembly.",
    highlight: '🏫 "Ryan, can you help set up the chairs?"',
    mascot: "Let's help Ryan! 🙌",
  },
  {
    id: 2,
    image: 'story_panel2',
    title: "Setting Up the Chairs",
    text: 'Ms. Parker said: "Ryan, please make 4 rows of chairs, with 5 chairs in each row." Ryan started placing them one by one.',
    highlight: '🪑 4 rows × 5 chairs in each row',
    mascot: 'How many chairs in total? 🤔',
  },
  {
    id: 3,
    image: 'story_panel3',
    title: "Ryan Discovers the Array!",
    text: "When Ryan finished, he stepped back and saw the chairs formed a perfect rectangle. Rows going across, columns going down — an ARRAY!",
    highlight: '✨ 4 rows × 5 columns = an ARRAY!',
    mascot: 'Rows across, columns down! 📐',
  },
  {
    id: 4,
    image: 'story_panel4',
    title: "Rows and Columns",
    text: 'Ms. Parker pointed at the board: "Rows go ACROSS ➡️. Columns go DOWN ⬇️. Your array has 4 rows and 5 columns!"',
    highlight: '➡️ Rows across  ·  ⬇️ Columns down',
    mascot: 'Count the rows and columns! 🔢',
  },
  {
    id: 5,
    image: 'story_panel5',
    title: "The Multiplication Sentence",
    text: 'Ms. Parker wrote on the whiteboard: 4 × 5 = 20. "This is a multiplication sentence! 4 rows of 5 equals 20 — no counting one by one!"',
    highlight: '✏️ 4 × 5 = 20  →  Rows × Columns = Total',
    mascot: "That's the multiplication shortcut! ⚡",
  },
  {
    id: 6,
    image: 'story_panel6',
    title: "Your Turn!",
    text: "Now YOU will build arrays, find missing numbers, and write multiplication sentences — just like Ryan. Rows × Columns = Total. Let's go!",
    highlight: '🚀 Build arrays  ·  Multiply  ·  Master it!',
    mascot: "You can do it! Let's multiply! 🌟",
  },
];

// ─── Main StoryPhase component ───────────────────────────────────────────────
export default function StoryPhase({ audioEnabled, onComplete }) {
  const [idx, setIdx] = useState(0);
  const panel = PANELS[idx];
  const total = PANELS.length;

  // Play per-panel narration whenever panel index or audioEnabled changes
  useEffect(() => {
    stopNarration();                         // stop whatever was playing
    if (audioEnabled) narrate(PANEL_NARRATION[idx]);
    return () => stopNarration();
  }, [idx, audioEnabled]);

  const goNext = () => {
    stopNarration();                         // stop current before moving
    if (idx < total - 1) setIdx(i => i + 1);
    else onComplete();
  };
  const goPrev = () => {
    stopNarration();
    setIdx(i => Math.max(0, i - 1));
  };

  return (
    <div className="phase-screen z-1" style={{ overflow: 'hidden', padding: 'clamp(20px, 4.5vh, 48px) 16px' }}>
      <div className="story-phase-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        flex: 1,
        justifyContent: 'center'
      }}>
        {/* Top Progress Indicator: Bar + label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          marginBottom: 14,
          flexShrink: 0
        }}>
          <div style={{
            flex: 1,
            height: 6,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 50,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((idx + 1) / total) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a855f7, #facc15)',
              borderRadius: 50,
              transition: 'width 0.4s ease'
            }} />
          </div>
          <span style={{
            fontFamily: 'Fredoka One, sans-serif',
            fontSize: 13,
            fontWeight: 900,
            color: 'rgba(255, 255, 255, 0.7)',
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}>
            {idx + 1} / {total}
          </span>
        </div>

        {/* Main Card */}
        <div className="story-card">
          {/* Illustration — PNG */}
          <div className="story-illustration">
            <img
              src={`/assets/images/${panel.image}.png`}
              alt={panel.title}
              className="scene-art"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* Text Content */}
          <div className="story-content">
            <div className="story-panel-title">{panel.title}</div>
            <p className="story-panel-text">{panel.text}</p>

            {/* Highlight box */}
            <div className="story-highlight">
              ✨ {panel.highlight.replace(/^[^\w\s"']+\s*/, '').trim()} ✨
            </div>

            {/* Mascot row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, boxShadow: '0 4px 12px rgba(251,191,36,0.3)',
                flexShrink: 0
              }}>
                🐻
              </div>
              <div style={{ position: 'relative', flex: 1 }}>
                <div style={{
                  background: '#fff', color: '#1a1a2e', borderRadius: '16px',
                  padding: '10px 16px', fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  position: 'relative', display: 'inline-block'
                }}>
                  {/* Speech bubble tail pointer */}
                  <div style={{
                    position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%) rotate(45deg)',
                    width: 10, height: 10, background: '#fff',
                  }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{panel.mascot}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sibling navigation below card */}
        <div className="story-nav" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 20,
          padding: '0 4px',
          flexShrink: 0
        }}>
          <button
            className="btn-story-back"
            onClick={goPrev}
            disabled={idx === 0}
            aria-label="Previous panel"
          >
            ← Back
          </button>

          <div className="story-dots" aria-label="Panel progress">
            {PANELS.map((_, i) => (
              <div
                key={i}
                className={`story-dot ${i === idx ? 'active' : ''}`}
                aria-label={`Panel ${i + 1}`}
              />
            ))}
          </div>

          <button className="btn-story-next" onClick={goNext} aria-label="Next panel">
            {idx < total - 1 ? 'Next →' : 'Simulate! 🧪'}
          </button>
        </div>
      </div>
    </div>
  );
}
