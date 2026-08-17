const items = [
  { text:'×', size:80, top:'8%',  left:'5%',  dur:'18s', delay:'0s'   },
  { text:'3', size:100,top:'20%', left:'88%', dur:'22s', delay:'2s'   },
  { text:'4', size:70, top:'55%', left:'3%',  dur:'26s', delay:'5s'   },
  { text:'=', size:90, top:'75%', left:'80%', dur:'20s', delay:'1s'   },
  { text:'12',size:60, top:'40%', left:'92%', dur:'24s', delay:'3s'   },
  { text:'×', size:110,top:'85%', left:'15%', dur:'30s', delay:'6s'   },
  { text:'9', size:75, top:'12%', left:'50%', dur:'19s', delay:'4s'   },
  { text:'6', size:85, top:'65%', left:'45%', dur:'23s', delay:'7s'   },
  { text:'×', size:65, top:'35%', left:'72%', dur:'21s', delay:'2.5s' },
  { text:'5', size:95, top:'90%', left:'60%', dur:'25s', delay:'8s'   },
];

export default function FloatingBg() {
  return (
    <div className="floating-bg" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className="float-num"
          style={{
            fontSize: it.size,
            top: it.top,
            left: it.left,
            '--dur': it.dur,
            '--delay': it.delay,
          }}
        >
          {it.text}
        </span>
      ))}
    </div>
  );
}
