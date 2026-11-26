import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from 'remotion';
import { loadFont as loadRoboto } from '@remotion/google-fonts/Roboto';
import { loadFont as loadCondensed } from '@remotion/google-fonts/RobotoCondensed';

const { fontFamily: ROBOTO } = loadRoboto('normal', { weights: ['300', '400', '700', '900'], subsets: ['latin'] });
const { fontFamily: CONDENSED } = loadCondensed('normal', { weights: ['700', '900'], subsets: ['latin'] });

const C = {
  negro: '#0a0a0a',
  verde: '#B8F259',
  lima: '#E1FD6D',
  naranja: '#FE883C',
  gris: '#E0E0E0',
  blanco: '#FFFFFF',
  rojo: '#EA0A0A',
};

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

const LOGO_B64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NC4xIj4NCjxwYXRoIGZpbGw9IiMxNDE0MTQiIGQ9Ik0yMC4zLDQzLjhjMCwwLjItMC4xLDAuMy0wLjQsMC4zSDAuNEMwLjEsNDQuMSwwLDQ0LDAsNDMuOGMwLTAuMiwwLjEtMC4yLDAuNC0wLjJoMS44YzAuMywwLDAuNS0wLjcsMC41LTJWMTEuN2MwLTEuMy0wLjItMi0wLjUtMkgwLjRDMC4xLDkuNywwLDkuNywwLDkuNWMwLTAuMiwwLjEtMC4zLDAuNC0wLjNoMThjMC4zLDAsMC40LDAuMSwwLjQsMC4zdjEwLjZjMCwwLjMtMC4xLDAuNC0wLjQsMC40Yy0wLjIsMC0wLjMtMC4xLTAuMy0wLjR2LTAuN2MwLjEtMi4zLTAuNS00LjUtMS41LTYuNWMtMC45LTEuOS0yLjktMy4xLTUtMy4xSDguNEM4LjEsOS44LDgsOS45LDgsMTB2MTUuM2MwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMC4yLDAsMC4zLDAuMSwwLjMsMC40djExLjljMCwwLjMtMC4xLDAuNC0wLjMsMC40Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjN2LTAuNmMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNkg4LjRjLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjF2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjRzMC40LDAuMSwwLjQsMC40TDIwLjMsNDMuOHoiLz4NCjxwYXRoIGZpbGw9IiMxNDE0MTQiIGQ9Ik00NCw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gyNGMtMC4zLDAtMC40LTAuMS0wLjQtMC4zYzAtMC4yLDAuMS0wLjIsMC40LTAuMmgxLjhjMC4zLDAsMC41LTAuNywwLjUtMlYxMS43YzAtMS4zLTAuMi0yLTAuNS0ySDI0Yy0wLjMsMC0wLjQtMC4xLTAuNC0wLjJjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNGMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMWgtMy4xYy0wLjMsMC0wLjUsMC4xLTAuNSwwLjJ2MTUuM2MwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMC4yLDAsMC4zLDAuMSwwLjMsMC40djExLjljMCwwLjMtMC4xLDAuNC0wLjMsMC40Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjN2LTAuNmMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNmgtMS43Yy0wLjMsMC0wLjUsMC4xLTAuNSwwLjN2MTYuOWMwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMi45YzIuOCwwLjEsNS41LTEuNCw2LjgtNGMxLTEuOSwxLjYtNCwxLjUtNi4xdi0wLjZjMC0wLjMsMC4xLTAuNCwwLjQtMC40czAuNCwwLjEsMC40LDAuNEw0NCw0My44eiIvPg0KPHJlY3QgZmlsbD0iI0VBMEEwQSIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjUuNiIvPg0KPC9zdmc+DQo=';

// ─── Lectura de capas ──────────────────────────────────────────────────────
const leerAttr = (svg, nombre, def) => {
  const m = String(svg || '').match(new RegExp(nombre + '="([^"]*)"'));
  return m ? m[1] : def;
};

const capasDe = (d) => {
  if (Array.isArray(d.capas) && d.capas.length) return d.capas;
  if (d.svg) return [d.svg];
  return [];
};

// ─── Movimiento por capa (determinista, función del frame) ────────────────
const animar = (tipo, f, fps, dur, i) => {
  const retraso = i * 5;
  const ent = spring({ frame: Math.max(0, f - retraso), fps, config: { damping: 15, stiffness: 70 } });
  const p = interpolate(f, [0, Math.max(1, dur)], [0, 1], CL);
  let tx = 0, ty = 0, s = 1, r = 0;
  let op = interpolate(f - retraso, [0, 10], [0, 1], CL);
  let trazo = 1;

  switch (tipo) {
    case 'fondo':
      op = 1;
      s = interpolate(p, [0, 1], [1.12, 1.0]);
      ty = interpolate(p, [0, 1], [20, -40]);
      break;
    case 'medio':
      s = interpolate(p, [0, 1], [1.15, 1.02]);
      ty = interpolate(p, [0, 1], [60, -90]);
      tx = interpolate(p, [0, 1], [-20, 20]);
      break;
    case 'principal':
      s = interpolate(ent, [0, 1], [0.78, 1]) * interpolate(p, [0, 1], [1, 1.06]);
      ty = interpolate(ent, [0, 1], [160, 0]) + Math.sin(f * 0.045) * 10;
      break;
    case 'zoom-golpe':
      s = interpolate(ent, [0, 1], [1.7, 1]);
      break;
    case 'flotar':
      ty = Math.sin(f * 0.06 + i * 1.7) * 22;
      tx = Math.cos(f * 0.045 + i) * 10;
      break;
    case 'rotar':
      r = f * 0.9;
      break;
    case 'girar-lento':
      r = f * 0.25;
      break;
    case 'manecilla':
      r = f * 4.5;
      break;
    case 'pulso':
      s = 1 + Math.sin(f * 0.13) * 0.06;
      op = op * (0.7 + 0.3 * (Math.sin(f * 0.13) * 0.5 + 0.5));
      break;
    case 'deslizar-izq':
      tx = interpolate(ent, [0, 1], [-650, 0]);
      break;
    case 'deslizar-der':
      tx = interpolate(ent, [0, 1], [650, 0]);
      break;
    case 'caer':
      ty = interpolate(ent, [0, 1], [-800, 0]);
      break;
    case 'subir':
      ty = interpolate(ent, [0, 1], [800, 0]);
      break;
    case 'particulas':
      ty = -f * 1.1;
      tx = Math.sin(f * 0.03 + i) * 25;
      break;
    case 'trazar':
      trazo = interpolate(f - retraso, [0, 50], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
      break;
    default:
      s = interpolate(ent, [0, 1], [0.9, 1]);
  }
  return { tx, ty, s, r, op, trazo };
};

const Capa = ({ svg, f, fps, dur, i }) => {
  const tipo = leerAttr(svg, 'data-anim', i === 0 ? 'fondo' : 'principal');
  const origen = leerAttr(svg, 'data-origen', '540 960').split(/\s+/).map(Number);
  const a = animar(tipo, f, fps, dur, i);
  return (
    <div
      className={tipo === 'trazar' ? 'capa-trazar' : undefined}
      style={{
        position: 'absolute', left: 0, top: 0, width: 1080, height: 1920,
        transform: `translate(${a.tx}px, ${a.ty}px) rotate(${a.r}deg) scale(${a.s})`,
        transformOrigin: `${origen[0] || 540}px ${origen[1] || 960}px`,
        opacity: a.op,
        '--p': a.trazo,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// ─── Cámara por escena ────────────────────────────────────────────────────
const Camara = ({ tipo, f, dur, children }) => {
  const p = interpolate(f, [0, Math.max(1, dur)], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  let s = 1, tx = 0, ty = 0;
  switch (tipo) {
    case 'alejar':
      s = interpolate(f, [0, 45], [1.35, 1.04], { ...CL, easing: Easing.out(Easing.cubic) }) * interpolate(p, [0, 1], [1, 1.05]);
      break;
    case 'paneo-arriba':
      s = 1.12; ty = interpolate(p, [0, 1], [110, -110]);
      break;
    case 'paneo-lado':
      s = 1.12; tx = interpolate(p, [0, 1], [-70, 70]);
      break;
    default:
      s = interpolate(p, [0, 1], [1.0, 1.14]);
      ty = interpolate(p, [0, 1], [0, -30]);
  }
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '540px 800px' }}>
      {children}
    </AbsoluteFill>
  );
};

const Ilustracion = ({ d, f, fps, dur, camaraDef }) => {
  const capas = capasDe(d);
  if (!capas.length) return null;
  return (
    <Camara tipo={d.camara || camaraDef} f={f} dur={dur}>
      {capas.map((svg, i) => <Capa key={i} svg={svg} f={f} fps={fps} dur={dur} i={i} />)}
    </Camara>
  );
};

// ─── Texto ────────────────────────────────────────────────────────────────
const entra = (f, fps, delay = 0, dist = 70) => {
  const s = spring({ frame: Math.max(0, f - delay), fps, config: { damping: 16, stiffness: 90 } });
  return {
    opacity: interpolate(f - delay, [0, 6], [0, 1], CL),
    transform: `translateY(${interpolate(s, [0, 1], [dist, 0])}px)`,
  };
};

const Resaltar = ({ texto, resaltado, color }) => {
  const t = String(texto || '');
  const r = String(resaltado || '');
  const i = r ? t.toLowerCase().indexOf(r.toLowerCase()) : -1;
  if (i < 0) return <>{t}</>;
  return (
    <>
      {t.slice(0, i)}
      <span style={{ color, textShadow: `0 0 40px ${color}88` }}>{t.slice(i, i + r.length)}</span>
      {t.slice(i + r.length)}
    </>
  );
};

const Etiqueta = ({ f, texto, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, opacity: interpolate(f, [0, 8], [0, 1], CL) }}>
    <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, boxShadow: `0 0 16px ${color}` }} />
    <span style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 30, letterSpacing: 7, textTransform: 'uppercase', color }}>{texto}</span>
  </div>
);

const BloqueTexto = ({ children }) => (
  <>
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 1050,
      background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.82) 45%, rgba(10,10,10,0.96) 100%)',
      zIndex: 5,
    }} />
    <div style={{ position: 'absolute', left: 80, right: 180, bottom: 420, zIndex: 10 }}>
      {children}
    </div>
  </>
);

const contar = (f, delay, valor, dur = 40) => {
  const v = Number(valor) || 0;
  const p = interpolate(f - delay, [0, dur], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const n = v * p;
  return v >= 1000 ? Math.round(n).toLocaleString('es-CO') : (Number.isInteger(v) ? Math.round(n) : n.toFixed(1));
};

const Marca = ({ f }) => (
  <img
    src={`data:image/svg+xml;base64,${LOGO_B64}`}
    style={{ position: 'absolute', left: 796, top: 1558, width: 75, zIndex: 20, filter: 'brightness(0) invert(1)', opacity: interpolate(f, [0, 10], [0, 0.9], CL) }}
  />
);

const TITULO = { fontFamily: ROBOTO, fontWeight: 900, color: C.blanco, lineHeight: 1.02, letterSpacing: -2, textShadow: '0 4px 30px rgba(0,0,0,0.9)' };

// ─── Escenas ──────────────────────────────────────────────────────────────
const Gancho = ({ d, f, fps, dur }) => {
  const lineas = (Array.isArray(d.lineas) ? d.lineas : String(d.texto || '').split('\n')).filter(Boolean).slice(0, 3);
  const acento = d.color_acento || C.naranja;
  const flash = interpolate(f, [0, 3, 12], [0.55, 0.55, 0], CL);
  const sacudida = f < 14 ? Math.sin(f * 2.2) * interpolate(f, [0, 14], [10, 0], CL) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: d.color_fondo || C.negro, transform: `translateX(${sacudida}px)` }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} camaraDef="alejar" />
      <BloqueTexto>
        <Etiqueta f={f - 8} texto={d.etiqueta || 'Especial'} color={acento} />
        {lineas.map((l, i) => {
          const ultima = i === lineas.length - 1 && lineas.length > 1;
          return (
            <div key={i} style={{ ...entra(f, fps, 10 + i * 9), marginBottom: 8 }}>
              <span style={{
                ...TITULO, fontSize: 108,
                display: 'inline-block',
                color: ultima ? C.negro : i === 1 ? C.verde : C.blanco,
                backgroundColor: ultima ? acento : 'transparent',
                padding: ultima ? '2px 18px 8px' : 0,
                textShadow: ultima ? 'none' : TITULO.textShadow,
              }}>{l}</span>
            </div>
          );
        })}
      </BloqueTexto>
      <AbsoluteFill style={{ backgroundColor: acento, opacity: flash, zIndex: 30, mixBlendMode: 'screen' }} />
      <Marca f={f} />
    </AbsoluteFill>
  );
};

const Contexto = ({ d, f, fps, dur }) => {
  const cifras = Array.isArray(d.cifras) ? d.cifras.slice(0, 2) : [];
  const colores = [C.naranja, C.verde];
  return (
    <AbsoluteFill style={{ backgroundColor: d.color_fondo || C.negro }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} camaraDef="paneo-arriba" />
      <BloqueTexto>
        <Etiqueta f={f - 4} texto={d.etiqueta || 'Contexto'} color={C.gris} />
        <div style={{ ...entra(f, fps, 8), ...TITULO, fontSize: 68, marginBottom: 36 }}>{d.titulo}</div>
        {cifras.length ? (
          <div style={{ display: 'flex', gap: 50 }}>
            {cifras.map((c, i) => (
              <div key={i} style={{ ...entra(f, fps, 20 + i * 14), flex: 1 }}>
                <div style={{ fontFamily: CONDENSED, fontWeight: 900, fontSize: cifras.length === 1 ? 190 : 140, lineHeight: 0.95, color: colores[i], textShadow: `0 0 50px ${colores[i]}66` }}>
                  {contar(f, 20 + i * 14, c.valor)}<span style={{ fontSize: 64 }}>{c.sufijo || ''}</span>
                </div>
                <div style={{ fontFamily: ROBOTO, fontWeight: 700, fontSize: 36, color: C.gris, lineHeight: 1.2, marginTop: 10 }}>{c.etiqueta}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...entra(f, fps, 18), fontFamily: ROBOTO, fontWeight: 700, fontSize: 50, color: C.gris, lineHeight: 1.25 }}>{d.texto}</div>
        )}
      </BloqueTexto>
      <Marca f={f} />
    </AbsoluteFill>
  );
};

const Dato = ({ d, f, fps, dur }) => {
  const pasos = Array.isArray(d.pasos) ? d.pasos.slice(0, 2) : [];
  return (
    <AbsoluteFill style={{ backgroundColor: d.color_fondo || C.negro }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} camaraDef="acercar" />
      <BloqueTexto>
        <Etiqueta f={f - 4} texto={d.etiqueta || 'Dato clave'} color={C.verde} />
        <div style={{ ...entra(f, fps, 8), ...TITULO, fontSize: 84, marginBottom: 30 }}>
          {String(d.titulo || '').split('\n').map((l, i) => (
            <div key={i}><Resaltar texto={l} resaltado={d.resaltado} color={C.verde} /></div>
          ))}
        </div>
        {pasos.map((p, i) => (
          <div key={i} style={{ ...entra(f, fps, 26 + i * 12, 40), display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.verde, boxShadow: `0 0 18px ${C.verde}`, flexShrink: 0 }} />
            <div style={{ fontFamily: ROBOTO, fontWeight: 700, fontSize: 42, color: C.blanco, lineHeight: 1.15 }}>
              {p.nombre ? <span style={{ color: C.verde }}>{p.nombre} </span> : null}{p.texto || ''}
            </div>
          </div>
        ))}
      </BloqueTexto>
      <Marca f={f} />
    </AbsoluteFill>
  );
};

const Impacto = ({ d, f, fps, dur }) => {
  const hay = d.numero !== undefined && d.numero !== null && d.numero !== '';
  const s = spring({ frame: Math.max(0, f - 14), fps, config: { damping: 11, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ backgroundColor: d.color_fondo || C.negro }}>
      <Ilustracion d={d} f={f} fps={fps} dur={dur} camaraDef="acercar" />
      <BloqueTexto>
        <Etiqueta f={f - 4} texto={d.etiqueta || 'Impacto'} color={C.lima} />
        {d.titulo ? <div style={{ ...entra(f, fps, 6), fontFamily: ROBOTO, fontWeight: 700, fontSize: 46, color: C.gris, marginBottom: 10 }}>{d.titulo}</div> : null}
        {hay ? (
          <div style={{
            fontFamily: CONDENSED, fontWeight: 900, fontSize: 280, lineHeight: 0.9, color: C.lima,
            transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, transformOrigin: 'left center',
            opacity: interpolate(f - 14, [0, 6], [0, 1], CL), textShadow: `0 0 90px ${C.lima}77`, marginBottom: 16,
          }}>
            {contar(f, 16, d.numero, 45)}{d.sufijo || ''}
          </div>
        ) : null}
        <div style={{ ...entra(f, fps, hay ? 40 : 14), fontFamily: ROBOTO, fontWeight: 900, fontSize: hay ? 52 : 74, color: C.blanco, lineHeight: 1.12 }}>
          <Resaltar texto={d.texto} resaltado={d.resaltado} color={C.lima} />
        </div>
      </BloqueTexto>
      <Marca f={f} />
    </AbsoluteFill>
  );
};

const Cierre = ({ d, f, fps, dur }) => (
  <AbsoluteFill style={{ backgroundColor: C.negro }}>
    <Ilustracion d={d} f={f} fps={fps} dur={dur} camaraDef="acercar" />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.85) 70%)', zIndex: 5 }} />
    <AbsoluteFill style={{ zIndex: 10, alignItems: 'center', justifyContent: 'center', padding: '280px 120px 350px', textAlign: 'center' }}>
      <div style={{ ...entra(f, fps, 6), ...TITULO, fontSize: 92, marginBottom: 70 }}>
        {String(d.titulo || '').split('\n').map((l, i) => (
          <div key={i}><Resaltar texto={l} resaltado={d.resaltado} color={C.verde} /></div>
        ))}
      </div>
      <img
        src={`data:image/svg+xml;base64,${LOGO_B64}`}
        style={{
          width: 150, filter: 'brightness(0) invert(1)',
          opacity: interpolate(f, [28, 50], [0, 1], CL),
          transform: `scale(${interpolate(f, [28, 90], [1.035, 1], CL)})`,
        }}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ─── Transición: barrido de color ─────────────────────────────────────────
const Barrido = ({ f, color }) => {
  const y = interpolate(f, [0, 18], [1920, -1920], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ zIndex: 50, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: y, height: 1920, background: `linear-gradient(180deg, ${color}00 0%, ${color} 18%, ${color} 82%, ${color}00 100%)` }} />
    </AbsoluteFill>
  );
};

const ESTILO_GLOBAL = `
.capa-trazar path, .capa-trazar line, .capa-trazar polyline, .capa-trazar polygon, .capa-trazar circle, .capa-trazar ellipse, .capa-trazar rect {
  stroke-dasharray: 4000;
  stroke-dashoffset: calc((1 - var(--p)) * 4000px);
}
`;

// ─── Principal ────────────────────────────────────────────────────────────
export const EEVideo = ({ audioUrl, escenas, tiempos }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const e = escenas && typeof escenas === 'object' && !Array.isArray(escenas) ? escenas : {};

  const t = Array.isArray(tiempos) ? tiempos.map(Number) : [];
  let inicios;
  if (t.length === 5 && t.every((x) => !isNaN(x))) {
    inicios = t.map((x) => Math.max(0, Math.round(x * fps)));
    inicios[0] = 0;
  } else {
    const k = durationInFrames / 900;
    inicios = [0, 160, 380, 580, 780].map((n) => Math.round(n * k));
  }
  const dur = (i) => (i < 4 ? inicios[i + 1] + 8 : durationInFrames) - inicios[i];

  const comps = [Gancho, Contexto, Dato, Impacto, Cierre];
  const claves = ['gancho', 'contexto', 'dato', 'impacto', 'cierre'];
  const coloresBarrido = [C.naranja, C.verde, C.lima, C.naranja];

  return (
    <AbsoluteFill style={{ backgroundColor: C.negro, fontFamily: ROBOTO }}>
      <style>{ESTILO_GLOBAL}</style>
      {audioUrl ? <Audio src={audioUrl} /> : null}
      {comps.map((Comp, i) => (
        <Sequence key={`e${i}`} from={inicios[i]} durationInFrames={Math.max(1, dur(i))}>
          <Comp d={e[claves[i]] || {}} f={frame - inicios[i]} fps={fps} dur={Math.max(1, dur(i))} />
        </Sequence>
      ))}
      {[1, 2, 3, 4].map((i) => (
        <Sequence key={`b${i}`} from={Math.max(0, inicios[i] - 9)} durationInFrames={20}>
          <Barrido f={frame - Math.max(0, inicios[i] - 9)} color={coloresBarrido[i - 1]} />
        </Sequence>
      ))}
      <div style={{
        position: 'absolute', top: 0, left: 0, height: 8, zIndex: 60, backgroundColor: C.rojo,
        width: interpolate(frame, [0, durationInFrames], [0, 1080], CL),
      }} />
    </AbsoluteFill>
  );
};
