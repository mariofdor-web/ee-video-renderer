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

// ─── Identidad visual EE ───────────────────────────────────────────────────
const C = {
  fondo:   '#101010',
  verde:   '#B8F259',
  lima:    '#E1FD6D',
  naranja: '#FE883C',
  gris:    '#E0E0E0',
  blanco:  '#FFFFFF',
  rojo:    '#EA0A0A',
  negro:   '#141414',
};

const LOGO_B64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy43LjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ0IDQ0LjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0IDQ0LjE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMxNDE0MTQ7fQ0KCS5zdDF7ZmlsbDojRUEwQTBBO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAuMyw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gwLjRDMC4xLDQ0LjEsMCw0NCwwLDQzLjhjMC0wLjIsMC4xLTAuMiwwLjQtMC4yaDEuOGMwLjMsMCwwLjUtMC43LDAuNS0yDQoJVjExLjdjMC0xLjMtMC4yLTItMC41LTJIMC40QzAuMSw5LjcsMCw5LjcsMCw5LjVjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNA0KCWMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMUg4LjRDOC4xLDkuOCw4LDkuOSw4LDEwdjE1LjNjMCwwLjIsMC4xLDAuMiwwLjQsMC4yDQoJaDEuN2MxLjEsMCwyLjItMC42LDIuOC0xLjZjMC44LTEsMS4yLTIuMywxLjEtMy42di0wLjVjMC0wLjIsMC4xLTAuNCwwLjMtMC40YzAsMCwwLjEsMCwwLjEsMGMwLjIsMCwwLjMsMC4xLDAuMywwLjR2MTEuOQ0KCWMwLDAuMy0wLjEsMC40LTAuMywwLjRjLTAuMiwwLTAuNC0wLjEtMC40LTAuM2MwLDAsMC0wLjEsMC0wLjF2LTAuNWMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNkg4LjQNCgljLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjF2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjQNCglzMC40LDAuMSwwLjQsMC40TDIwLjMsNDMuOHoiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NCw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gyNGMtMC4zLDAtMC40LTAuMS0wLjQtMC4zYzAtMC4yLDAuMS0wLjIsMC40LTAuMmgxLjhjMC4zLDAsMC41LTAuNywwLjUtMlYxMS43DQoJYzAtMS4zLTAuMi0yLTAuNS0ySDI0Yy0wLjMsMC0wLjQtMC4xLTAuNC0wLjJjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNA0KCWMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMWgtMy4xYy0wLjMsMCwwLjUsMC4xLTAuNSwwLjJ2MTUuMw0KCWMwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMCwwLDAuMSwwLDAuMSwwDQoJYzAuMiwwLDAuMywwLjEsMC4zLDAuNHYxMS45YzAsMC4zLTAuMSwwLjQtMC4zLDAuNGMtMC4yLDAtMC40LTAuMS0wLjQtMC4zYzAsMCwwLTAuMSwwLTAuMXYtMC41YzAtMS4zLTAuNC0yLjYtMS4xLTMuNw0KCWMtMC42LTEtMS42LTEuNi0yLjgtMS42aC0xLjdjLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjENCgl2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjRzMC40LDAuMSwwLjQsMC40TDQ0LDQzLjh6Ii8+DQo8cmVjdCB4PSIwIiBjbGFzcz0ic3QxIiB3aWR0aD0iNDQiIGhlaWdodD0iNS42Ii8+DQo8L3N2Zz4NCg==';

// ─── Utilidades ────────────────────────────────────────────────────────────
const fadeUp = (frame, fps, delay = 0) => {
  const f = Math.max(0, frame - delay);
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 60 } });
  return {
    opacity: interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px)`,
  };
};

const fadeIn = (frame, delay = 0) => ({
  opacity: interpolate(Math.max(0, frame - delay), [0, 12], [0, 1], { extrapolateRight: 'clamp' }),
});

const countUp = (frame, delay, from, to, duration = 40) => {
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(from + (to - from) * progress);
};

// ─── Componentes base ──────────────────────────────────────────────────────
const LogoEE = ({ size = 48 }) => (
  <img src={`data:image/svg+xml;base64,${LOGO_B64}`} style={{ width: size, height: size }} />
);

const MarcaFija = () => (
  <div style={{ position: 'absolute', bottom: 60, right: 80, zIndex: 100 }}>
    <LogoEE size={36} />
  </div>
);

const Etiqueta = ({ frame, delay = 0, texto, color = C.verde }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48, ...fadeIn(frame, delay) }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
    <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color }}>
      {texto}
    </span>
  </div>
);

// ─── Ayudas para textos dinámicos ─────────────────────────────────────────
const lineasDe = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean);

const tam = (texto, base, maxLetras) => {
  const n = String(texto || '').length || 1;
  return Math.round(base * Math.max(0.55, Math.min(1, maxLetras / n)));
};

const ConResaltado = ({ texto, resaltado, color }) => {
  const t = String(texto || '');
  const r = String(resaltado || '');
  const i = r ? t.toLowerCase().indexOf(r.toLowerCase()) : -1;
  if (i < 0) return <>{t}</>;
  return (
    <>
      {t.slice(0, i)}
      <span style={{ color }}>{t.slice(i, i + r.length)}</span>
      {t.slice(i + r.length)}
    </>
  );
};

const contar = (frame, delay, valor, duracion = 35) => {
  const v = Number(valor) || 0;
  const p = interpolate(Math.max(0, frame - delay), [0, duracion], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const dec = (String(valor).split('.')[1] || '').length;
  return (v * p).toFixed(Math.min(dec, 1));
};

const ESCENAS_DEFECTO = {
  gancho: { etiqueta: 'Especial', lineas: ['Imagina buscar', 'trabajo', 'sin poder mostrar', 'lo que sabes hacer.'] },
  contexto: {
    titulo: 'Personas con empleo en Colombia',
    cifras: [
      { valor: 2, total: 10, etiqueta: 'Con discapacidad' },
      { valor: 6, total: 10, etiqueta: 'Sin discapacidad' },
    ],
    fuente: 'Fuente: DANE julio-septiembre 2026',
  },
  dato: {
    titulo: 'Bogotá lanzó\nuna guía\npara contratar',
    resaltado: 'una guía',
    subtitulo: 'Secretaría de Desarrollo Económico de Bogotá',
    pasos: [
      { nombre: 'Antes', texto: 'Define funciones esenciales del cargo' },
      { nombre: 'Durante', texto: 'Selecciona por habilidades reales' },
      { nombre: 'Después', texto: 'Haz los ajustes necesarios' },
    ],
  },
  impacto: {
    titulo: 'Empresas vinculadas al programa en Bogotá',
    numero: 731,
    texto: 'Con incentivos económicos y acompañamiento de las cajas de compensación',
    resaltado: 'cajas de compensación',
  },
  cierre: {
    titulo: '¿Contratas personal?\nEncuentra el manual',
    resaltado: 'Encuentra el manual',
    subtitulo: 'Canales digitales oficiales de la Secretaría de Desarrollo Económico de Bogotá',
  },
};

// ─── ESCENA 1 — Gancho ────────────────────────────────────────────────────
const Escena1Gancho = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineas = d.lineas && d.lineas.length ? d.lineas : lineasDe(d.texto);
  const size = tam(lineas.join(' '), 96, 60);
  const lineaW = interpolate(Math.max(0, frame - 5), [0, 25], [0, 900], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '0 80px', justifyContent: 'center' }}>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Etiqueta frame={frame} delay={0} texto={d.etiqueta || 'Especial'} color={C.naranja} />
        <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: size, lineHeight: 1.1, color: C.blanco, marginBottom: 48 }}>
          {lineas.map((l, i) => {
            const ultima = i === lineas.length - 1 && lineas.length > 1;
            const verde = i === 1 && lineas.length > 2;
            const estilo = ultima
              ? { display: 'inline-block', backgroundColor: C.naranja, color: C.fondo, padding: '0 16px' }
              : verde ? { color: C.verde } : {};
            return <div key={i} style={{ ...estilo, ...fadeUp(frame, fps, 4 + i * 8) }}>{l}</div>;
          })}
        </div>
        <div style={{ height: 4, width: lineaW, backgroundColor: C.verde, marginTop: 20 }} />
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 2 — Contexto ──────────────────────────────────────────────────
const Escena2Contexto = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cifras = (d.cifras || []).slice(0, 2);
  const colores = [C.naranja, C.verde];
  const maximo = Math.max(...cifras.map((c) => Number(c.total) || Number(c.valor) || 1), 1);
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <Etiqueta frame={frame} delay={0} texto={d.etiqueta || 'Contexto'} color={C.gris} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: tam(d.titulo, 44, 60), color: C.gris, lineHeight: 1.3, marginBottom: 80, ...fadeIn(frame, 4) }}>
        {d.titulo}
      </div>
      {cifras.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 60, height: 680, paddingBottom: 80 }}>
          {cifras.map((c, i) => {
            const delay = 20 + i * 35;
            const alto = interpolate(Math.max(0, frame - delay), [0, 35], [0, 600 * ((Number(c.valor) || 0) / maximo)], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
            const sufijo = c.total ? `/${c.total}` : c.sufijo || '';
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: cifras.length === 1 ? 180 : 140, color: colores[i], lineHeight: 1, marginBottom: 16, ...fadeIn(frame, delay) }}>
                  {contar(frame, delay, c.valor)}<span style={{ fontSize: 60 }}>{sufijo}</span>
                </div>
                <div style={{ width: '100%', height: alto, backgroundColor: colores[i], borderRadius: '8px 8px 0 0' }} />
                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 32, color: C.gris, textAlign: 'center', marginTop: 20, ...fadeIn(frame, delay) }}>{c.etiqueta}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: tam(d.texto, 72, 90), color: C.blanco, lineHeight: 1.2, ...fadeUp(frame, fps, 12) }}>{d.texto}</div>
      )}
      {d.fuente ? (
        <div style={{ position: 'absolute', bottom: 90, left: 80, fontFamily: 'Arial, sans-serif', fontSize: 26, color: 'rgba(224,224,224,0.5)', ...fadeIn(frame, 80) }}>{d.fuente}</div>
      ) : null}
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 3 — Dato clave ────────────────────────────────────────────────
const Escena3DatoClave = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasos = (d.pasos || []).slice(0, 3);
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, backgroundColor: C.verde }} />
      <Etiqueta frame={frame} delay={0} texto={d.etiqueta || 'Dato clave'} color={C.verde} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: tam(d.titulo, 72, 45), color: C.blanco, lineHeight: 1.1, marginBottom: 24, ...fadeUp(frame, fps, 6) }}>
        {lineasDe(d.titulo).map((l, i) => <div key={i}><ConResaltado texto={l} resaltado={d.resaltado} color={C.verde} /></div>)}
      </div>
      {d.subtitulo ? (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 38, color: C.gris, lineHeight: 1.4, marginBottom: 72, ...fadeIn(frame, 20) }}>{d.subtitulo}</div>
      ) : null}
      {pasos.length > 0 ? (
        <div style={{ display: 'flex', gap: 24 }}>
          {pasos.map((p, i) => (
            <div key={i} style={{ flex: 1, borderTop: `6px solid ${C.verde}`, paddingTop: 24, ...fadeUp(frame, fps, 30 + i * 15) }}>
              <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 36, color: C.verde, letterSpacing: 4, marginBottom: 12, textTransform: 'uppercase' }}>{p.nombre}</div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, color: C.gris, lineHeight: 1.4 }}>{p.texto}</div>
            </div>
          ))}
        </div>
      ) : null}
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 4 — Impacto ───────────────────────────────────────────────────
const Escena4Impacto = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hayNumero = d.numero !== undefined && d.numero !== null && d.numero !== '';
  const s = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 100 } });
  const scaleVal = interpolate(s, [0, 1], [0.6, 1]);
  const opacityVal = interpolate(Math.max(0, frame - 20), [0, 6], [0, 1], { extrapolateRight: 'clamp' });
  const lineaW = interpolate(Math.max(0, frame - 70), [0, 20], [0, 200], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <Etiqueta frame={frame} delay={0} texto={d.etiqueta || 'Impacto'} color={C.lima} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 400, fontSize: tam(d.titulo, 44, 60), color: C.gris, lineHeight: 1.3, marginBottom: 48, ...fadeIn(frame, 6) }}>{d.titulo}</div>
      {hayNumero ? (
        <>
          <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: tam(String(d.numero) + (d.sufijo || ''), 300, 4), lineHeight: 0.9, color: C.lima, transform: `scale(${scaleVal})`, opacity: opacityVal, marginBottom: 24 }}>
            {contar(frame, 25, d.numero, 50)}{d.sufijo || ''}
          </div>
          <div style={{ height: 6, width: lineaW, backgroundColor: C.lima, borderRadius: 3, marginBottom: 32 }} />
        </>
      ) : null}
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: tam(d.texto, hayNumero ? 44 : 64, hayNumero ? 90 : 110), color: C.blanco, lineHeight: 1.3, ...fadeIn(frame, hayNumero ? 72 : 20) }}>
        <ConResaltado texto={d.texto} resaltado={d.resaltado} color={C.lima} />
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 5 — Cierre ────────────────────────────────────────────────────
const Escena5Cierre = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.negro, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '80px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(184,242,89,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: tam(d.titulo, 68, 45), color: C.blanco, textAlign: 'center', lineHeight: 1.2, marginBottom: 60, zIndex: 10, ...fadeUp(frame, fps, 4) }}>
        {lineasDe(d.titulo).map((l, i) => <div key={i}><ConResaltado texto={l} resaltado={d.resaltado} color={C.verde} /></div>)}
      </div>
      {d.subtitulo ? (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 36, color: C.gris, textAlign: 'center', lineHeight: 1.5, marginBottom: 100, zIndex: 10, ...fadeIn(frame, 20) }}>{d.subtitulo}</div>
      ) : null}
      <div style={{ zIndex: 10, ...fadeIn(frame, 30) }}><LogoEE size={120} /></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 12, backgroundColor: C.rojo, ...fadeIn(frame, 10) }} />
    </AbsoluteFill>
  );
};

// ─── Transición ────────────────────────────────────────────────────────────
const Transicion = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 12, 20], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ backgroundColor: C.verde, opacity, zIndex: 50 }} />;
};

// ─── Componente principal ─────────────────────────────────────────────────
export const EEVideo = ({ audioUrl, escenas, tiempos }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const e = escenas && typeof escenas === 'object' ? escenas : ESCENAS_DEFECTO;
  const vacio = {};
  let inicios;
  const t = Array.isArray(tiempos) ? tiempos.map(Number) : [];
  if (t.length === 5 && t.every((x) => !isNaN(x))) {
    inicios = t.map((x) => Math.max(0, Math.round(x * fps)));
    inicios[0] = 0;
  } else {
    const k = durationInFrames / 900;
    inicios = [0, 160, 380, 580, 780].map((n) => Math.round(n * k));
  }
  const fin = (i) => (i < 4 ? inicios[i + 1] + 5 : durationInFrames) - inicios[i];
  const escenasLista = [
    <Escena1Gancho d={e.gancho || vacio} />,
    <Escena2Contexto d={e.contexto || vacio} />,
    <Escena3DatoClave d={e.dato || vacio} />,
    <Escena4Impacto d={e.impacto || vacio} />,
    <Escena5Cierre d={e.cierre || vacio} />,
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo }}>
      {audioUrl && <Audio src={audioUrl} />}
      {escenasLista.map((esc, i) => (
        <Sequence key={`e${i}`} from={inicios[i]} durationInFrames={Math.max(1, fin(i))}>{esc}</Sequence>
      ))}
      {[1, 2, 3, 4].map((i) => (
        <Sequence key={`t${i}`} from={Math.max(0, inicios[i] - 12)} durationInFrames={25}><Transicion /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

