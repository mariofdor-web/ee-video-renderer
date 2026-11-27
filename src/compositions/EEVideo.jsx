import {
  AbsoluteFill, Audio, useCurrentFrame, useVideoConfig,
  interpolate, spring, Sequence, Easing, random,
} from 'remotion';
import { loadFont as loadRoboto } from '@remotion/google-fonts/Roboto';
import { loadFont as loadCondensed } from '@remotion/google-fonts/RobotoCondensed';

const { fontFamily: ROBOTO } = loadRoboto('normal', { weights: ['300','400','700','900'], subsets: ['latin'] });
const { fontFamily: CONDENSED } = loadCondensed('normal', { weights: ['700','900'], subsets: ['latin'] });

const C = { negro:'#0a0a0a', verde:'#B8F259', lima:'#E1FD6D', naranja:'#FE883C', gris:'#E0E0E0', blanco:'#FFFFFF', rojo:'#EA0A0A' };
const CL = { extrapolateLeft:'clamp', extrapolateRight:'clamp' };
const EO = (e) => ({ ...CL, easing: e });
const spr = (f, fps, delay=0, cfg={damping:12,stiffness:60}) =>
  spring({ frame: Math.max(0, f-delay), fps, config: cfg });

const LOGO_B64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NC4xIj4NCjxwYXRoIGZpbGw9IiMxNDE0MTQiIGQ9Ik0yMC4zLDQzLjhjMCwwLjItMC4xLDAuMy0wLjQsMC4zSDAuNEMwLjEsNDQuMSwwLDQ0LDAsNDMuOGMwLTAuMiwwLjEtMC4yLDAuNC0wLjJoMS44YzAuMywwLDAuNS0wLjcsMC41LTJWMTEuN2MwLTEuMy0wLjItMi0wLjUtMkgwLjRDMC4xLDkuNywwLDkuNywwLDkuNWMwLTAuMiwwLjEtMC4zLDAuNC0wLjNoMThjMC4zLDAsMC40LDAuMSwwLjQsMC4zdjEwLjZjMCwwLjMtMC4xLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjR2LTAuN2MwLjEtMi4zLTAuNS00LjUtMS41LTYuNWMtMC45LTEuOS0yLjktMy4xLTUtMy4xSDguNEM4LjEsOS44LDgsOS45LDgsMTB2MTUuM2MwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMC4yLDAsMC4zLDAuMSwwLjMsMC40djExLjljMCwwLjMtMC4xLDAuNC0wLjMsMC40Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjN2LTAuNmMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNkg4LjRjLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjF2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjRzMC40LDAuMSwwLjQsMC40TDIwLjMsNDMuOHoiLz4NCjxwYXRoIGZpbGw9IiMxNDE0MTQiIGQ9Ik00NCw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gyNGMtMC4zLDAtMC40LTAuMS0wLjQtMC4zYzAtMC4yLDAuMS0wLjIsMC40LTAuMmgxLjhjMC4zLDAsMC41LTAuNywwLjUtMlYxMS43YzAtMS4zLTAuMi0yLTAuNS0ySDI0Yy0wLjMsMC0wLjQtMC4xLTAuNC0wLjJjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNGMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMWgtMy4xYy0wLjMsMC0wLjUsMC4xLTAuNSwwLjJ2MTUuM2MwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMC4yLDAsMC4zLDAuMSwwLjMsMC40djExLjljMCwwLjMtMC4xLDAuNC0wLjMsMC40Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjN2LTAuNmMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNmgtMS43Yy0wLjMsMC0wLjUsMC4xLTAuNSwwLjN2MTYuOWMwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMi45YzIuOCwwLjEsNS41LTEuNCw2LjgtNGMxLTEuOSwxLjYtNCwxLjUtNi4xdi0wLjZjMC0wLjMsMC4xLTAuNCwwLjQtMC40czAuNCwwLjEsMC40LDAuNEw0NCw0My44eiIvPg0KPHJlY3QgZmlsbD0iI0VBMEEwQSIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjUuNiIvPg0KPC9zdmc+DQo=';

// ─── Utilidades de color ──────────────────────────────────────────────────
const hexRgb = (h) => {
  const s = String(h||'#000000').replace('#','');
  const v = s.length===3 ? s.split('').map(c=>c+c).join('') : s.padEnd(6,'0').slice(0,6);
  return [0,2,4].map(k=>parseInt(v.slice(k,k+2),16)||0);
};
const mezclar = (a, b, t) => {
  const A=hexRgb(a), B=hexRgb(b);
  return '#'+A.map((x,k)=>Math.round(x+(B[k]-x)*t).toString(16).padStart(2,'0')).join('');
};
const alfa = (h, a) => { const [r,g,b]=hexRgb(h); return `rgba(${r},${g},${b},${a})`; };

// ─── Biblioteca de recursos SVG compartidos ───────────────────────────────
// Definidos una sola vez en el documento. Las capas de Claude los usan con url(#ee_...).
const VOLUMENES = { verde:C.verde, naranja:C.naranja, lima:C.lima, rojo:C.rojo, blanco:C.blanco, gris:'#6a6a6a', oscuro:'#3a3a3a' };
const LUCES = { verde:C.verde, naranja:C.naranja, lima:C.lima, rojo:C.rojo, blanco:C.blanco };
const REGION = { x:'-40%', y:'-40%', width:'180%', height:'180%' };

const Defs = () => (
  // No usar display:none: Chromium no resuelve gradientes de un SVG oculto así.
  <svg width="0" height="0" aria-hidden="true" style={{ position:'absolute', width:0, height:0, overflow:'hidden' }}>
    <defs>
      {Object.entries(VOLUMENES).map(([k,c]) => (
        <linearGradient key={`v-${k}`} id={`ee_vol_${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mezclar(c,'#ffffff',0.35)}/>
          <stop offset="0.45" stopColor={c}/>
          <stop offset="1" stopColor={mezclar(c,'#000000',0.62)}/>
        </linearGradient>
      ))}
      {Object.entries(LUCES).map(([k,c]) => (
        <radialGradient key={`l-${k}`} id={`ee_luz_${k}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={c} stopOpacity="0.9"/>
          <stop offset="0.4" stopColor={c} stopOpacity="0.35"/>
          <stop offset="1" stopColor={c} stopOpacity="0"/>
        </radialGradient>
      ))}
      <linearGradient id="ee_brillo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.7"/>
        <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
      </linearGradient>
      <radialGradient id="ee_sombra_suelo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000000" stopOpacity="0.65"/>
        <stop offset="1" stopColor="#000000" stopOpacity="0"/>
      </radialGradient>
      <filter id="ee_sombra" {...REGION}>
        <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#000000" floodOpacity="0.55"/>
      </filter>
      <filter id="ee_desenfoque" {...REGION}>
        <feGaussianBlur stdDeviation="6"/>
      </filter>
      <filter id="ee_glow" {...REGION}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="ee_glow_fuerte" {...REGION}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  </svg>
);

// ─── Movimiento por capa ──────────────────────────────────────────────────
const mover = (tipo, f, fps, dur, i) => {
  const delay = i * 6;
  const s1 = spr(f, fps, delay);
  const p = interpolate(f, [0, Math.max(1,dur)], [0,1], CL);
  let tx=0, ty=0, sc=1, r=0, op=interpolate(f-delay,[0,10],[0,1],CL), trazo=1;

  switch(tipo) {
    case 'fondo':
      op=1; sc=interpolate(p,[0,1],[1.18,1.0]); ty=interpolate(p,[0,1],[30,-60]);
      break;
    case 'fondo-lateral':
      op=1; sc=interpolate(p,[0,1],[1.12,1.0]); tx=interpolate(p,[0,1],[-40,40]);
      break;
    case 'medio':
      sc=interpolate(p,[0,1],[1.2,1.04]); ty=interpolate(p,[0,1],[80,-120]); tx=interpolate(p,[0,1],[-30,30]);
      break;
    case 'principal':
      sc=interpolate(s1,[0,1],[0.72,1]) * interpolate(p,[0,1],[1,1.08]);
      ty=interpolate(s1,[0,1],[200,0]) + Math.sin(f*0.04)*12;
      break;
    case 'zoom-golpe':
      sc=interpolate(s1,[0,1],[1.9,1]) * interpolate(p,[0,1],[1,1.06]);
      op=interpolate(f-delay,[0,4],[0,1],CL);
      break;
    case 'revelacion':
      sc=interpolate(s1,[0,1],[0.5,1]);
      op=interpolate(f-delay,[0,8],[0,1],CL);
      ty=interpolate(s1,[0,1],[120,0]);
      break;
    case 'flotar':
      ty=Math.sin(f*0.055+i*2.1)*26; tx=Math.cos(f*0.038+i)*14;
      break;
    case 'flotar-lento':
      ty=Math.sin(f*0.028+i*1.3)*18; tx=Math.cos(f*0.022+i)*8;
      break;
    case 'rotar':
      r=f*1.1; op=interpolate(f-delay,[0,8],[0,1],CL);
      break;
    case 'girar-lento':
      r=f*0.3;
      break;
    case 'manecilla':
      r=f*4.8;
      break;
    case 'pulso':
      sc=1+Math.sin(f*0.14)*0.07;
      op=op*(0.65+0.35*(Math.sin(f*0.14)*0.5+0.5));
      break;
    case 'pulso-lento':
      sc=1+Math.sin(f*0.07)*0.04;
      op=op*(0.7+0.3*(Math.sin(f*0.07)*0.5+0.5));
      break;
    case 'deslizar-izq':
      tx=interpolate(s1,[0,1],[-750,0]); op=interpolate(f-delay,[0,6],[0,1],CL);
      break;
    case 'deslizar-der':
      tx=interpolate(s1,[0,1],[750,0]); op=interpolate(f-delay,[0,6],[0,1],CL);
      break;
    case 'deslizar-arriba':
      ty=interpolate(s1,[0,1],[-700,0]); op=interpolate(f-delay,[0,6],[0,1],CL);
      break;
    case 'caer':
      ty=interpolate(s1,[0,1],[-900,0]); op=interpolate(f-delay,[0,5],[0,1],CL);
      break;
    case 'subir':
      ty=interpolate(s1,[0,1],[900,0]) + Math.sin(f*0.05)*8;
      op=interpolate(f-delay,[0,5],[0,1],CL);
      break;
    case 'particulas':
      ty=-f*1.3; tx=Math.sin(f*0.04+i*1.4)*30; op=interpolate(f-delay,[0,6],[0,0.9],CL);
      break;
    case 'trazar':
      trazo=interpolate(f-delay,[0,55],[0,1],EO(Easing.out(Easing.cubic)));
      op=interpolate(f-delay,[0,8],[0,1],CL);
      break;
    case 'parpadeo':
      op=(Math.round(Math.sin(f*0.5)*0.5+0.5))*interpolate(f-delay,[0,8],[0,1],CL);
      break;
    case 'ondear':
      ty=Math.sin(f*0.08)*35; r=Math.sin(f*0.06)*3;
      break;
    case 'zoom-out':
      sc=interpolate(p,[0,1],[1.5,1.0]); op=interpolate(f-delay,[0,10],[0,1],CL);
      break;
    default:
      sc=interpolate(s1,[0,1],[0.88,1]);
  }
  return { tx, ty, sc, r, op, trazo };
};

const leer = (svg, attr, def) => { const m=String(svg||'').match(new RegExp(attr+'="([^"]*)"')); return m?m[1]:def; };
const capasDe = d => Array.isArray(d.capas)&&d.capas.length ? d.capas : d.svg ? [d.svg] : [];

// Claude ahora manda solo un <g>; la raíz la pone el motor. Las capas viejas con <svg> siguen funcionando.
const RAIZ = '<svg viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">';
const envolver = (s) => /^\s*<svg/i.test(s) ? s : `${RAIZ}${s}</svg>`;

const LIENZO = { position:'absolute', left:0, top:0, width:1080, height:1920 };

const Capa = ({ svg, f, fps, dur, i }) => {
  const tipo = leer(svg,'data-anim','principal');
  const origen = leer(svg,'data-origen','540 960').split(/\s+/).map(Number);
  const a = mover(tipo, f, fps, dur, i);
  return (
    <div
      className={tipo==='trazar' ? 'capa-trazar' : undefined}
      style={{
        ...LIENZO,
        transform:`translate(${a.tx}px,${a.ty}px) rotate(${a.r}deg) scale(${a.sc})`,
        transformOrigin:`${origen[0]||540}px ${origen[1]||960}px`,
        opacity: a.op,
        '--p': a.trazo,
      }}
      dangerouslySetInnerHTML={{ __html: envolver(svg) }}
    />
  );
};

// ─── Capas generadas por código ───────────────────────────────────────────
const FondoCodigo = ({ fondo, acento, f, fps, dur }) => {
  const a = mover('fondo', f, fps, dur, 0);
  return (
    <div style={{
      ...LIENZO,
      transform:`translate(${a.tx}px,${a.ty}px) scale(${a.sc})`,
      transformOrigin:'540px 960px',
      background:[
        `radial-gradient(ellipse 75% 42% at 50% 30%, ${alfa(acento,0.28)} 0%, ${alfa(acento,0.08)} 45%, transparent 75%)`,
        `radial-gradient(ellipse 60% 30% at 15% 85%, ${alfa(acento,0.06)} 0%, transparent 70%)`,
        `linear-gradient(180deg, ${mezclar(fondo,'#ffffff',0.07)} 0%, ${fondo} 55%, #000000 100%)`,
      ].join(','),
    }}/>
  );
};

const ParticulasCodigo = ({ acento, semilla, f, n=36 }) => {
  const op = interpolate(f,[0,12],[0,1],CL);
  const puntos = Array.from({ length:n }, (_,k) => {
    const rnd = (t) => random(`${semilla}-${t}-${k}`);
    const vel = 0.6 + rnd('v')*1.6;
    const radio = 1.5 + rnd('r')*4;
    const fase = rnd('f')*Math.PI*2;
    const y = (((rnd('y')*1920 - f*vel) % 1920) + 1920) % 1920;
    const x = rnd('x')*1080 + Math.sin(f*0.03+fase)*18;
    const brillo = 0.35 + 0.65*(Math.sin(f*0.09+fase)*0.5+0.5);
    return (
      <circle key={k} cx={x} cy={y} r={radio}
        fill={rnd('c')<0.3 ? C.blanco : acento}
        opacity={brillo*0.8}
        filter={radio>4.2 ? 'url(#ee_glow)' : undefined}/>
    );
  });
  return <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={{ ...LIENZO, opacity:op }}>{puntos}</svg>;
};

// ─── Cámara cinematográfica ───────────────────────────────────────────────
const Camara = ({ tipo, f, fps, dur, children }) => {
  const p = interpolate(f,[0,Math.max(1,dur)],[0,1],EO(Easing.inOut(Easing.cubic)));
  let sc=1, tx=0, ty=0, r=0;
  switch(tipo) {
    case 'alejar':
      sc=interpolate(f,[0,50],[1.5,1.05],EO(Easing.out(Easing.cubic))) * interpolate(p,[0,1],[1,1.06]);
      break;
    case 'acercar':
      sc=interpolate(p,[0,0.6,1],[1.0,1.18,1.14],EO(Easing.inOut(Easing.cubic)));
      ty=interpolate(p,[0,1],[0,-60]);
      break;
    case 'paneo-arriba':
      sc=1.14; ty=interpolate(p,[0,1],[130,-130]);
      break;
    case 'paneo-abajo':
      sc=1.14; ty=interpolate(p,[0,1],[-130,130]);
      break;
    case 'paneo-lado':
      sc=1.14; tx=interpolate(p,[0,1],[-80,80]);
      break;
    case 'paneo-diagonal':
      sc=1.18; tx=interpolate(p,[0,1],[-70,70]); ty=interpolate(p,[0,1],[90,-90]);
      break;
    case 'orbita':
      sc=1.1;
      tx=Math.sin(f*0.025)*55;
      ty=Math.cos(f*0.018)*35;
      break;
    case 'zoom-reverso':
      sc=interpolate(p,[0,1],[1.0,1.4]); ty=interpolate(p,[0,1],[0,80]);
      break;
    case 'shake':
      tx=f<20?Math.sin(f*3.5)*interpolate(f,[0,20],[14,0],CL):0;
      ty=f<20?Math.cos(f*2.8)*interpolate(f,[0,20],[8,0],CL):0;
      sc=interpolate(p,[0,1],[1.0,1.1]);
      break;
    default:
      sc=interpolate(p,[0,1],[1.0,1.1]);
  }
  return (
    <AbsoluteFill style={{ transform:`translate(${tx}px,${ty}px) rotate(${r}deg) scale(${sc})`, transformOrigin:'540px 850px', overflow:'hidden' }}>
      {children}
    </AbsoluteFill>
  );
};

const ACENTO_DEF = { gancho:C.naranja, contexto:C.verde, dato:C.verde, impacto:C.lima, cierre:C.verde };

// Orden fijo: fondo (código) → capas de Claude → partículas (código).
// Aunque Claude falle, la escena conserva fondo y atmósfera.
const Ilustracion = ({ d, f, fps, dur, clave, camaraDef='acercar' }) => {
  const capas = capasDe(d);
  const acento = d.color_acento || ACENTO_DEF[clave] || C.verde;
  return (
    <Camara tipo={d.camara||camaraDef} f={f} fps={fps} dur={dur}>
      <FondoCodigo fondo={d.color_fondo||C.negro} acento={acento} f={f} fps={fps} dur={dur}/>
      {capas.map((svg,i) => <Capa key={i} svg={svg} f={f} fps={fps} dur={dur} i={i+1}/>)}
      <ParticulasCodigo acento={acento} semilla={clave} f={f}/>
    </Camara>
  );
};

// ─── Ilustración fija del cierre (marca, no la genera Claude) ─────────────
const CierreVisual = ({ f, fps, dur }) => {
  const rayos = interpolate(f,[8,60],[0,1],EO(Easing.out(Easing.cubic)));
  const latido = 1 + Math.sin(f*0.08)*0.06;
  return (
    <Camara tipo="zoom-reverso" f={f} fps={fps} dur={dur}>
      <FondoCodigo fondo={C.negro} acento={C.verde} f={f} fps={fps} dur={dur}/>
      <svg viewBox="0 0 1080 1920" width="1080" height="1920" style={LIENZO}>
        {Array.from({ length:18 }, (_,k) => {
          const ang = (k/18)*Math.PI*2 + f*0.0025;
          const ini = 170, fin = 170 + 1000*rayos;
          return (
            <line key={`r${k}`}
              x1={540+Math.cos(ang)*ini} y1={860+Math.sin(ang)*ini}
              x2={540+Math.cos(ang)*fin} y2={860+Math.sin(ang)*fin}
              stroke={k%3===0 ? C.lima : C.verde} strokeWidth={k%3===0 ? 3 : 1.5} opacity={0.22}/>
          );
        })}
        {Array.from({ length:5 }, (_,k) => {
          const t = ((f*0.7 + k*52) % 260) / 260;
          return (
            <circle key={`o${k}`} cx={540} cy={860} r={120 + t*900}
              fill="none" stroke={C.verde} strokeWidth={3 - t*2.2} opacity={(1-t)*0.5}/>
          );
        })}
        <circle cx={540} cy={860} r={260*latido} fill="url(#ee_luz_verde)" opacity={0.55}/>
        <circle cx={540} cy={860} r={70*latido} fill="none" stroke={C.verde} strokeWidth={4} filter="url(#ee_glow)" opacity={interpolate(f,[0,20],[0,0.9],CL)}/>
      </svg>
      <ParticulasCodigo acento={C.verde} semilla="cierre" f={f} n={50}/>
    </Camara>
  );
};

// ─── Texto y UI ───────────────────────────────────────────────────────────
const entra = (f, fps, delay=0, dist=70, cfg={damping:14,stiffness:85}) => {
  const s = spr(f, fps, delay, cfg);
  return { opacity:interpolate(f-delay,[0,7],[0,1],CL), transform:`translateY(${interpolate(s,[0,1],[dist,0])}px)` };
};
const entX = (f, fps, delay=0, dist=90) => {
  const s = spr(f, fps, delay, {damping:14,stiffness:85});
  return { opacity:interpolate(f-delay,[0,7],[0,1],CL), transform:`translateX(${interpolate(s,[0,1],[dist,0])}px)` };
};

const Resaltar = ({ texto, resaltado, color }) => {
  const t=String(texto||''), r=String(resaltado||'');
  const i=r?t.toLowerCase().indexOf(r.toLowerCase()):-1;
  if(i<0) return <>{t}</>;
  return <>{t.slice(0,i)}<span style={{color,textShadow:`0 0 50px ${color}99`}}>{t.slice(i,i+r.length)}</span>{t.slice(i+r.length)}</>;
};

const Overlay = () => (
  <div style={{
    position:'absolute', left:0, right:0, bottom:0, height:1100,
    background:'linear-gradient(180deg,rgba(10,10,10,0) 0%,rgba(10,10,10,0.75) 40%,rgba(10,10,10,0.97) 100%)',
    zIndex:5,
  }}/>
);

const BloqueTexto = ({ children }) => (
  <>
    <Overlay/>
    <div style={{ position:'absolute', left:80, right:80, bottom:380, zIndex:10 }}>{children}</div>
  </>
);

const Marca = ({ f }) => (
  <img src={`data:image/svg+xml;base64,${LOGO_B64}`} style={{
    position:'absolute', left:796, top:1558, width:75, zIndex:20,
    filter:'brightness(0) invert(1)',
    opacity:interpolate(f,[0,12],[0,0.9],CL),
  }}/>
);

const BarraProgreso = ({ f, dur }) => (
  <div style={{
    position:'absolute', bottom:0, left:0, zIndex:60, height:5,
    width:interpolate(f,[0,Math.max(1,dur)],[0,1080],CL),
    background:`linear-gradient(90deg,${C.rojo},#ff6b6b)`,
  }}/>
);

const contar = (f, delay, valor, dur=42) => {
  const v=Number(valor)||0;
  const p=interpolate(f-delay,[0,dur],[0,1],EO(Easing.out(Easing.cubic)));
  const n=v*Math.max(0,Math.min(1,p));
  return v>=1000?Math.round(n).toLocaleString('es-CO'):Number.isInteger(v)?Math.round(n):n.toFixed(1);
};

const TITULO = { fontFamily:ROBOTO, fontWeight:900, color:C.blanco, lineHeight:1.0, letterSpacing:-2, textShadow:'0 3px 25px rgba(0,0,0,0.95)' };

// ─── Escenas ──────────────────────────────────────────────────────────────
const Gancho = ({ d, f, fps, dur }) => {
  const lineas=(Array.isArray(d.lineas)?d.lineas:String(d.texto||'').split('\n')).filter(Boolean).slice(0,3);
  const acento=d.color_acento||C.naranja;
  const sacudida=f<10?Math.sin(f*2.4)*interpolate(f,[0,10],[8,0],CL):0;
  return (
    <AbsoluteFill style={{ backgroundColor:d.color_fondo||C.negro, transform:`translateX(${sacudida}px)` }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} clave="gancho" camaraDef="alejar"/>
      <BloqueTexto>
        {lineas.map((l,i) => {
          const ultima=i===lineas.length-1&&lineas.length>1;
          const accentLine=i===1;
          return (
            <div key={i} style={{...entra(f,fps,8+i*10), marginBottom:6}}>
              <span style={{
                ...TITULO, fontSize:112, display:'inline-block',
                color:ultima?C.negro:accentLine?C.verde:C.blanco,
                backgroundColor:ultima?acento:'transparent',
                padding:ultima?'4px 22px 10px':0,
                textShadow:ultima?'none':TITULO.textShadow,
              }}>{l}</span>
            </div>
          );
        })}
        <div style={{
          marginTop:20, height:4,
          width:interpolate(Math.max(0,f-24),[0,28],[0,420],EO(Easing.out(Easing.cubic))),
          background:`linear-gradient(90deg,${acento},${C.verde})`,
          borderRadius:2,
        }}/>
      </BloqueTexto>
      <BarraProgreso f={f} dur={dur}/>
      <Marca f={f}/>
    </AbsoluteFill>
  );
};

const Contexto = ({ d, f, fps, dur }) => {
  const cifras=Array.isArray(d.cifras)?d.cifras.slice(0,2):[];
  const cols=[C.naranja,C.verde];
  return (
    <AbsoluteFill style={{ backgroundColor:d.color_fondo||C.negro }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} clave="contexto" camaraDef="paneo-arriba"/>
      <BloqueTexto>
        <div style={{...entra(f,fps,6), ...TITULO, fontSize:66, marginBottom:32}}>{d.titulo}</div>
        {cifras.length?(
          <div style={{display:'flex',gap:50}}>
            {cifras.map((c,i)=>(
              <div key={i} style={{...entra(f,fps,18+i*16),flex:1}}>
                <div style={{fontFamily:CONDENSED,fontWeight:900,fontSize:cifras.length===1?200:148,lineHeight:0.9,color:cols[i],textShadow:`0 0 60px ${cols[i]}77`}}>
                  {contar(f,18+i*16,c.valor)}<span style={{fontSize:70}}>{c.sufijo||''}</span>
                </div>
                <div style={{fontFamily:ROBOTO,fontWeight:700,fontSize:38,color:C.gris,lineHeight:1.2,marginTop:12}}>{c.etiqueta}</div>
              </div>
            ))}
          </div>
        ):(
          <div style={{...entra(f,fps,16),fontFamily:ROBOTO,fontWeight:700,fontSize:52,color:C.gris,lineHeight:1.3}}>{d.texto}</div>
        )}
      </BloqueTexto>
      <BarraProgreso f={f} dur={dur}/>
      <Marca f={f}/>
    </AbsoluteFill>
  );
};

const Dato = ({ d, f, fps, dur }) => {
  const pasos=Array.isArray(d.pasos)?d.pasos.slice(0,2):[];
  return (
    <AbsoluteFill style={{ backgroundColor:d.color_fondo||C.negro }}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:7,background:`linear-gradient(180deg,${C.verde},${C.verde}00)`,opacity:interpolate(f,[0,18],[0,1],CL)}}/>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} clave="dato" camaraDef="paneo-diagonal"/>
      <BloqueTexto>
        <div style={{...entra(f,fps,6),...TITULO,fontSize:86,marginBottom:28}}>
          {String(d.titulo||'').split('\n').map((l,i)=><div key={i}><Resaltar texto={l} resaltado={d.resaltado} color={C.verde}/></div>)}
        </div>
        {pasos.map((p,i)=>(
          <div key={i} style={{...entX(f,fps,22+i*14,60),display:'flex',alignItems:'center',gap:20,marginBottom:16}}>
            <div style={{width:14,height:14,borderRadius:7,backgroundColor:C.verde,boxShadow:`0 0 20px ${C.verde}`,flexShrink:0}}/>
            <div style={{fontFamily:ROBOTO,fontWeight:700,fontSize:44,color:C.blanco,lineHeight:1.15}}>
              {p.nombre?<span style={{color:C.verde}}>{p.nombre} </span>:null}{p.texto||String(p)}
            </div>
          </div>
        ))}
      </BloqueTexto>
      <BarraProgreso f={f} dur={dur}/>
      <Marca f={f}/>
    </AbsoluteFill>
  );
};

const Impacto = ({ d, f, fps, dur }) => {
  const hay=d.numero!==undefined&&d.numero!==null&&d.numero!=='';
  const s1=spr(f,fps,12,{damping:9,stiffness:130});
  return (
    <AbsoluteFill style={{ backgroundColor:d.color_fondo||C.negro }}>
      {hay&&(
        <div style={{
          position:'absolute',top:'25%',left:'50%',transform:'translate(-50%,-50%)',
          width:700,height:700,borderRadius:'50%',
          background:`radial-gradient(circle,${C.lima}22 0%,transparent 70%)`,
          opacity:interpolate(f,[10,30],[0,1],CL),
        }}/>
      )}
      <Ilustracion d={d} f={f} fps={fps} dur={dur} clave="impacto" camaraDef="orbita"/>
      <BloqueTexto>
        {d.titulo?<div style={{...entra(f,fps,4),fontFamily:ROBOTO,fontWeight:700,fontSize:46,color:C.gris,marginBottom:12}}>{d.titulo}</div>:null}
        {hay?(
          <>
            <div style={{
              fontFamily:CONDENSED,fontWeight:900,fontSize:300,lineHeight:0.88,color:C.lima,
              transform:`scale(${interpolate(s1,[0,1],[0.35,1])})`,transformOrigin:'left center',
              opacity:interpolate(f-12,[0,6],[0,1],CL),textShadow:`0 0 100px ${C.lima}88`,marginBottom:20,
            }}>
              {contar(f,14,d.numero,48)}{d.sufijo||''}
            </div>
            <div style={{height:5,width:interpolate(Math.max(0,f-50),[0,22],[0,340],EO(Easing.out(Easing.cubic))),background:`linear-gradient(90deg,${C.lima},transparent)`,marginBottom:28,borderRadius:3}}/>
          </>
        ):null}
        <div style={{...entra(f,fps,hay?55:12),fontFamily:ROBOTO,fontWeight:900,fontSize:hay?52:76,color:C.blanco,lineHeight:1.12}}>
          <Resaltar texto={d.texto} resaltado={d.resaltado} color={C.lima}/>
        </div>
      </BloqueTexto>
      <BarraProgreso f={f} dur={dur}/>
      <Marca f={f}/>
    </AbsoluteFill>
  );
};

const Cierre = ({ d, f, fps, dur }) => (
  <AbsoluteFill style={{ backgroundColor:C.negro }}>
    <CierreVisual f={f} fps={fps} dur={dur}/>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 55%,rgba(10,10,10,0.3) 0%,rgba(10,10,10,0.88) 70%)',zIndex:5}}/>
    <AbsoluteFill style={{zIndex:10,alignItems:'center',justifyContent:'center',padding:'300px 110px 350px',textAlign:'center'}}>
      <div style={{...entra(f,fps,4),...TITULO,fontSize:94,marginBottom:80}}>
        {String(d.titulo||'').split('\n').map((l,i)=><div key={i}><Resaltar texto={l} resaltado={d.resaltado} color={C.verde}/></div>)}
      </div>
      <img src={`data:image/svg+xml;base64,${LOGO_B64}`} style={{
        width:150,filter:'brightness(0) invert(1)',
        opacity:interpolate(f,[30,55],[0,1],CL),
        transform:`scale(${interpolate(f,[30,100],[1.04,1],CL)})`,
      }}/>
    </AbsoluteFill>
    <BarraProgreso f={f} dur={dur}/>
  </AbsoluteFill>
);

// ─── Transición: barrido diagonal ─────────────────────────────────────────
const Barrido = ({ f, color }) => {
  const p = interpolate(f,[0,22],[-1,2.2],EO(Easing.inOut(Easing.cubic)));
  return (
    <AbsoluteFill style={{zIndex:50,pointerEvents:'none',overflow:'hidden'}}>
      <div style={{
        position:'absolute',left:0,right:0,top:0,bottom:0,
        background:`linear-gradient(135deg,transparent ${(p-0.25)*100}%,${color} ${p*100}%,${color} ${(p+0.08)*100}%,transparent ${(p+0.33)*100}%)`,
      }}/>
    </AbsoluteFill>
  );
};

const ESTILOS = `
.capa-trazar path,.capa-trazar line,.capa-trazar polyline,.capa-trazar polygon,.capa-trazar circle,.capa-trazar ellipse,.capa-trazar rect {
  stroke-dasharray:4000; stroke-dashoffset:calc((1 - var(--p,0)) * 4000px);
}`;

// ─── Principal ────────────────────────────────────────────────────────────
export const EEVideo = ({ audioUrl, escenas, tiempos }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const e = escenas&&typeof escenas==='object'&&!Array.isArray(escenas) ? escenas : {};

  const t = Array.isArray(tiempos)?tiempos.map(Number):[];
  let inicios;
  if(t.length===5&&t.every(x=>!isNaN(x))) {
    inicios=t.map(x=>Math.max(0,Math.round(x*fps))); inicios[0]=0;
  } else {
    const k=durationInFrames/900;
    inicios=[0,160,380,580,780].map(n=>Math.round(n*k));
  }
  const dur=i=>(i<4?inicios[i+1]+8:durationInFrames)-inicios[i];

  const comps=[Gancho,Contexto,Dato,Impacto,Cierre];
  const claves=['gancho','contexto','dato','impacto','cierre'];
  const colsBarrido=[C.naranja,C.verde,C.lima,C.naranja];

  return (
    <AbsoluteFill style={{backgroundColor:C.negro,fontFamily:ROBOTO}}>
      <style>{ESTILOS}</style>
      <Defs/>
      {audioUrl?<Audio src={audioUrl}/>:null}
      {comps.map((Comp,i)=>(
        <Sequence key={`e${i}`} from={inicios[i]} durationInFrames={Math.max(1,dur(i))}>
          <Comp d={e[claves[i]]||{}} f={frame-inicios[i]} fps={fps} dur={Math.max(1,dur(i))}/>
        </Sequence>
      ))}
      {[1,2,3,4].map(i=>(
        <Sequence key={`b${i}`} from={Math.max(0,inicios[i]-10)} durationInFrames={26}>
          <Barrido f={frame-Math.max(0,inicios[i]-10)} color={colsBarrido[i-1]}/>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
