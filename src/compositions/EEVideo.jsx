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

// ─── ESCENA 1 — Gancho ────────────────────────────────────────────────────
const Escena1Gancho = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineaW = interpolate(Math.max(0, frame - 5), [0, 25], [0, 900], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '0 80px', justifyContent: 'center' }}>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Etiqueta frame={frame} delay={0} texto="Especial" color={C.naranja} />
        <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 96, lineHeight: 1.1, color: C.blanco, marginBottom: 48 }}>
          <div style={fadeUp(frame, fps, 4)}>Imagina buscar</div>
          <div style={{ color: C.verde, ...fadeUp(frame, fps, 12) }}>trabajo</div>
          <div style={fadeUp(frame, fps, 20)}>sin poder mostrar</div>
          <div style={{ display: 'inline-block', backgroundColor: C.naranja, color: C.fondo, padding: '0 16px', ...fadeUp(frame, fps, 28) }}>
            lo que sabes hacer.
          </div>
        </div>
        <div style={{ height: 4, width: lineaW, backgroundColor: C.verde, marginTop: 20 }} />
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 2 — Contexto ──────────────────────────────────────────────────
const Escena2Contexto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const val1 = countUp(frame, 20, 0, 2, 35);
  const val2 = countUp(frame, 55, 0, 6, 35);
  const bar1H = interpolate(Math.max(0, frame - 20), [0, 35], [0, 240], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const bar2H = interpolate(Math.max(0, frame - 55), [0, 35], [0, 600], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <Etiqueta frame={frame} delay={0} texto="Contexto" color={C.gris} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 44, color: C.gris, lineHeight: 1.3, marginBottom: 80, ...fadeIn(frame, 4) }}>
        Personas con empleo en Colombia
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 60, height: 680, paddingBottom: 80 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 140, color: C.naranja, lineHeight: 1, marginBottom: 16, ...fadeIn(frame, 20) }}>
            {val1}<span style={{ fontSize: 60 }}>/10</span>
          </div>
          <div style={{ width: '100%', height: bar1H, backgroundColor: C.naranja, borderRadius: '8px 8px 0 0' }} />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 32, color: C.gris, textAlign: 'center', marginTop: 20, ...fadeIn(frame, 20) }}>
            Con discapacidad
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 140, color: C.verde, lineHeight: 1, marginBottom: 16, ...fadeIn(frame, 55) }}>
            {val2}<span style={{ fontSize: 60 }}>/10</span>
          </div>
          <div style={{ width: '100%', height: bar2H, backgroundColor: C.verde, borderRadius: '8px 8px 0 0' }} />
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 32, color: C.gris, textAlign: 'center', marginTop: 20, ...fadeIn(frame, 55) }}>
            Sin discapacidad
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 80, fontFamily: 'Arial, sans-serif', fontSize: 26, color: 'rgba(224,224,224,0.5)', ...fadeIn(frame, 80) }}>
        Fuente: DANE julio-septiembre 2026
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 3 — Dato clave ────────────────────────────────────────────────
const Escena3DatoClave = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasos = ['ANTES', 'DURANTE', 'DESPUES'];
  const textos = ['Define funciones esenciales del cargo', 'Selecciona por habilidades reales', 'Haz los ajustes necesarios'];

  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, backgroundColor: C.verde }} />
      <Etiqueta frame={frame} delay={0} texto="Dato clave" color={C.verde} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 72, color: C.blanco, lineHeight: 1.1, marginBottom: 24, ...fadeUp(frame, fps, 6) }}>
        Bogota lanzo<br /><span style={{ color: C.verde }}>una guia</span><br />para contratar
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 38, color: C.gris, lineHeight: 1.4, marginBottom: 72, ...fadeIn(frame, 20) }}>
        Secretaria de Desarrollo Economico de Bogota
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {pasos.map((paso, i) => (
          <div key={paso} style={{ flex: 1, borderTop: `6px solid ${C.verde}`, paddingTop: 24, ...fadeUp(frame, fps, 30 + i * 15) }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 36, color: C.verde, letterSpacing: 4, marginBottom: 12 }}>{paso}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, color: C.gris, lineHeight: 1.4 }}>{textos[i]}</div>
          </div>
        ))}
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 4 — Impacto ───────────────────────────────────────────────────
const Escena4Impacto = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numero = countUp(frame, 25, 0, 731, 50);
  const s = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 100 } });
  const scaleVal = interpolate(s, [0, 1], [0.6, 1]);
  const opacityVal = interpolate(Math.max(0, frame - 20), [0, 6], [0, 1], { extrapolateRight: 'clamp' });

  const lineaW = interpolate(Math.max(0, frame - 70), [0, 20], [0, 200], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo, padding: '140px 80px 100px' }}>
      <Etiqueta frame={frame} delay={0} texto="Impacto" color={C.lima} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 400, fontSize: 44, color: C.gris, lineHeight: 1.3, marginBottom: 48, ...fadeIn(frame, 6) }}>
        Empresas vinculadas al programa en Bogota
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 300, lineHeight: 0.9, color: C.lima, transform: `scale(${scaleVal})`, opacity: opacityVal, marginBottom: 24 }}>
        {numero}
      </div>
      <div style={{ height: 6, width: lineaW, backgroundColor: C.lima, borderRadius: 3, marginBottom: 32 }} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 44, color: C.blanco, lineHeight: 1.3, ...fadeIn(frame, 72) }}>
        Con incentivos economicos y acompanamiento de las <span style={{ color: C.lima }}>cajas de compensacion</span>
      </div>
      <MarcaFija />
    </AbsoluteFill>
  );
};

// ─── ESCENA 5 — Cierre ────────────────────────────────────────────────────
const Escena5Cierre = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.negro, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '80px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(184,242,89,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 68, color: C.blanco, textAlign: 'center', lineHeight: 1.2, marginBottom: 60, zIndex: 10, ...fadeUp(frame, fps, 4) }}>
        Contratas personal?<br /><span style={{ color: C.verde }}>Encuentra el manual</span>
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 36, color: C.gris, textAlign: 'center', lineHeight: 1.5, marginBottom: 100, zIndex: 10, ...fadeIn(frame, 20) }}>
        Canales digitales oficiales de la Secretaria de Desarrollo Economico de Bogota
      </div>
      <div style={{ zIndex: 10, ...fadeIn(frame, 30) }}>
        <LogoEE size={120} />
      </div>
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
export const EEVideo = ({ guion, audioUrl }) => {
  const { durationInFrames } = useVideoConfig();
  const k = durationInFrames / 900;
  const S = (n) => Math.round(n * k);
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo }}>
      {audioUrl && <Audio src={audioUrl} />}
      <Sequence from={0} durationInFrames={S(165)}><Escena1Gancho /></Sequence>
      <Sequence from={S(160) - 15} durationInFrames={25}><Transicion /></Sequence>
      <Sequence from={S(160)} durationInFrames={S(225)}><Escena2Contexto /></Sequence>
      <Sequence from={S(380) - 15} durationInFrames={25}><Transicion /></Sequence>
      <Sequence from={S(380)} durationInFrames={S(195)}><Escena3DatoClave /></Sequence>
      <Sequence from={S(580) - 15} durationInFrames={25}><Transicion /></Sequence>
      <Sequence from={S(580)} durationInFrames={S(195)}><Escena4Impacto /></Sequence>
      <Sequence from={S(780) - 15} durationInFrames={25}><Transicion /></Sequence>
      <Sequence from={S(780)} durationInFrames={durationInFrames - S(780)}><Escena5Cierre /></Sequence>
    </AbsoluteFill>
  );
};

