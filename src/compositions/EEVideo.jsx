import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  staticFile,
} from 'remotion';

// ─── Paleta EE ────────────────────────────────────────────────────────────
const C = {
  negro:   '#0a0a0a',
  fondoA:  '#0d0f14',
  fondoB:  '#080c10',
  verde:   '#B8F259',
  lima:    '#E1FD6D',
  naranja: '#FE883C',
  gris:    '#E0E0E0',
  blanco:  '#FFFFFF',
  rojo:    '#EA0A0A',
  azul:    '#1a3a5c',
};

const LOGO_B64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy43LjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ0IDQ0LjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0IDQ0LjE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMxNDE0MTQ7fQ0KCS5zdDF7ZmlsbDojRUEwQTBBO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAuMyw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gwLjRDMC4xLDQ0LjEsMCw0NCwwLDQzLjhjMC0wLjIsMC4xLTAuMiwwLjQtMC4yaDEuOGMwLjMsMCwwLjUtMC43LDAuNS0yDQoJVjExLjdjMC0xLjMtMC4yLTItMC41LTJIMC40QzAuMSw5LjcsMCw5LjcsMCw5LjVjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNA0KCWMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMUg4LjRDOC4xLDkuOCw4LDkuOSw4LDEwdjE1LjNjMCwwLjIsMC4xLDAuMiwwLjQsMC4yDQoJaDEuN2MxLjEsMCwyLjItMC42LDIuOC0xLjZjMC44LTEsMS4yLTIuMywxLjEtMy42di0wLjVjMC0wLjIsMC4xLTAuNCwwLjMtMC40YzAsMCwwLjEsMCwwLjEsMGMwLjIsMCwwLjMsMC4xLDAuMywwLjR2MTEuOQ0KCWMwLDAuMy0wLjEsMC40LTAuMywwLjRjLTAuMiwwLTAuNC0wLjEtMC40LTAuM2MwLDAsMC0wLjEsMC0wLjF2LTAuNWMwLTEuMy0wLjQtMi42LTEuMS0zLjdjLTAuNi0xLTEuNi0xLjYtMi44LTEuNkg4LjQNCgljLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjF2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjQNCglzMC40LDAuMSwwLjQsMC40TDIwLjMsNDMuOHoiLz4NCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00NCw0My44YzAsMC4yLTAuMSwwLjMtMC40LDAuM0gyNGMtMC4zLDAtMC40LTAuMS0wLjQtMC4zYzAtMC4yLDAuMS0wLjIsMC40LTAuMmgxLjhjMC4zLDAsMC41LTAuNywwLjUtMlYxMS43DQoJYzAtMS4zLTAuMi0yLTAuNS0ySDI0Yy0wLjMsMC0wLjQtMC4xLTAuNC0wLjJjMC0wLjIsMC4xLTAuMywwLjQtMC4zaDE4YzAuMywwLDAuNCwwLjEsMC40LDAuM3YxMC42YzAsMC4zLTAuMSwwLjQtMC40LDAuNA0KCWMtMC4yLDAtMC4zLTAuMS0wLjMtMC40di0wLjdjMC4xLTIuMy0wLjUtNC41LTEuNS02LjVjLTAuOS0xLjktMi45LTMuMS01LTMuMWgtMy4xYy0wLjMsMCwwLjUsMC4xLTAuNSwwLjJ2MTUuMw0KCWMwLDAuMiwwLjEsMC4yLDAuNCwwLjJoMS43YzEuMSwwLDIuMi0wLjYsMi44LTEuNmMwLjgtMSwxLjItMi4zLDEuMS0zLjZ2LTAuNWMwLTAuMiwwLjEtMC40LDAuMy0wLjRjMCwwLDAuMSwwLDAuMSwwDQoJYzAuMiwwLDAuMywwLjEsMC4zLDAuNHYxMS45YzAsMC4zLTAuMSwwLjQtMC4zLDAuNGMtMC4yLDAtMC40LTAuMS0wLjQtMC4zYzAsMCwwLTAuMSwwLTAuMXYtMC41YzAtMS4zLTAuNC0yLjYtMS4xLTMuNw0KCWMtMC42LTEtMS42LTEuNi0yLjgtMS42aC0xLjdjLTAuMywwLTAuNSwwLjEtMC41LDAuM3YxNi45YzAsMC4yLDAuMSwwLjIsMC40LDAuMmgyLjljMi44LDAuMSw1LjUtMS40LDYuOC00YzEtMS45LDEuNi00LDEuNS02LjENCgl2LTAuNmMwLTAuMywwLjEtMC40LDAuNC0wLjRzMC40LDAuMSwwLjQsMC40TDQ0LDQzLjh6Ii8+DQo8cmVjdCB4PSIwIiBjbGFzcz0ic3QxIiB3aWR0aD0iNDQiIGhlaWdodD0iNS42Ii8+DQo8L3N2Zz4NCg==';

// ─── Utilidades de animación ───────────────────────────────────────────────
const spr = (frame, fps, delay = 0, config = { damping: 20, stiffness: 80 }) => {
  const f = Math.max(0, frame - delay);
  return spring({ frame: f, fps, config });
};

const fadeIn = (frame, delay = 0, duration = 15) => ({
  opacity: interpolate(Math.max(0, frame - delay), [0, duration], [0, 1], { extrapolateRight: 'clamp' }),
});

const slideUp = (frame, fps, delay = 0, distance = 60) => {
  const s = spr(frame, fps, delay);
  return {
    opacity: interpolate(Math.max(0, frame - delay), [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
  };
};

const slideLeft = (frame, fps, delay = 0, distance = 80) => {
  const s = spr(frame, fps, delay);
  return {
    opacity: interpolate(Math.max(0, frame - delay), [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateX(${interpolate(s, [0, 1], [distance, 0])}px)`,
  };
};

const pulse = (frame, speed = 0.05) => Math.sin(frame * speed) * 0.5 + 0.5;

const countUp = (frame, delay, to, duration = 40) => {
  const p = interpolate(Math.max(0, frame - delay), [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(to * p);
};

// ─── Componentes base ──────────────────────────────────────────────────────
const Logo = ({ size = 40, style = {} }) => (
  <img
    src={`data:image/svg+xml;base64,${LOGO_B64}`}
    style={{ width: size, height: size, filter: 'brightness(0) invert(1)', ...style }}
  />
);

const MarcaFija = ({ frame }) => (
  <div style={{
    position: 'absolute', bottom: 72, right: 60, zIndex: 100,
    ...fadeIn(frame, 10),
  }}>
    <Logo size={32} />
  </div>
);

const LineaRoja = ({ frame, delay = 0 }) => {
  const w = interpolate(Math.max(0, frame - delay), [0, 25], [0, 1080], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 8, backgroundColor: C.rojo,
      width: w, zIndex: 200,
    }} />
  );
};

const Etiqueta = ({ frame, delay = 0, texto, color = C.verde }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    marginBottom: 32, ...fadeIn(frame, delay),
  }}>
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0 0 12px ${color}`,
    }} />
    <span style={{
      fontFamily: '"Roboto Condensed", sans-serif',
      fontWeight: 700, fontSize: 22,
      letterSpacing: 6, textTransform: 'uppercase',
      color,
    }}>
      {texto}
    </span>
  </div>
);

// ─── SVG inline renderer ───────────────────────────────────────────────────
const SvgEscena = ({ svgCode, frame, delay = 0 }) => {
  if (!svgCode) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1,
      ...fadeIn(frame, delay, 20),
    }}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
};

// ─── ESCENA 1 — Gancho ────────────────────────────────────────────────────
const Escena1Gancho = ({ d, frame, fps }) => {
  const lineas = Array.isArray(d.lineas) ? d.lineas : (d.texto || '').split('\n').filter(Boolean);
  const color1 = d.color_acento || C.naranja;

  const particulas = Array.from({ length: 12 }, (_, i) => ({
    x: 80 + (i * 83) % 920,
    y: 200 + (i * 137) % 1600,
    r: 2 + (i % 3),
    delay: i * 4,
    color: i % 3 === 0 ? C.verde : i % 3 === 1 ? C.naranja : 'rgba(255,255,255,0.2)',
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 30% 40%, ${d.color_fondo || '#1a0f00'} 0%, ${C.fondoA} 60%, ${C.negro} 100%)`,
    }}>
      <LineaRoja frame={frame} delay={0} />

      {/* Partículas de fondo */}
      {particulas.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, top: p.y + interpolate(frame, [0, 300], [0, -30], { extrapolateRight: 'clamp' }),
          width: p.r * 2, height: p.r * 2,
          borderRadius: '50%',
          backgroundColor: p.color,
          opacity: 0.3 + pulse(frame + p.delay * 10, 0.03) * 0.4,
          boxShadow: `0 0 ${p.r * 4}px ${p.color}`,
        }} />
      ))}

      {/* SVG ilustración */}
      {d.svg && <SvgEscena svgCode={d.svg} frame={frame} delay={5} />}

      {/* Contenido */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        padding: '120px 80px 100px',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <Etiqueta frame={frame} delay={8} texto={d.etiqueta || 'Especial'} color={color1} />

        <div style={{ marginBottom: 40 }}>
          {lineas.map((l, i) => {
            const isLast = i === lineas.length - 1;
            const isAccent = i === 1;
            return (
              <div key={i} style={{
                ...slideUp(frame, fps, 10 + i * 10),
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 900,
                fontSize: isLast ? 100 : 88,
                lineHeight: 1.0,
                color: isLast ? C.fondoA : isAccent ? C.verde : C.blanco,
                backgroundColor: isLast ? color1 : 'transparent',
                padding: isLast ? '4px 20px' : '0',
                display: 'inline-block',
                marginBottom: 4,
                textShadow: isLast ? 'none' : `0 2px 40px rgba(0,0,0,0.8)`,
                letterSpacing: -2,
              }}>
                {l}
              </div>
            );
          })}
        </div>

        {/* Línea decorativa */}
        <div style={{
          height: 3,
          width: interpolate(Math.max(0, frame - 25), [0, 30], [0, 400], { extrapolateRight: 'clamp' }),
          background: `linear-gradient(90deg, ${C.verde}, transparent)`,
          borderRadius: 2,
        }} />
      </div>

      <MarcaFija frame={frame} />
    </AbsoluteFill>
  );
};

// ─── ESCENA 2 — Contexto ──────────────────────────────────────────────────
const Escena2Contexto = ({ d, frame, fps }) => {
  const cifras = Array.isArray(d.cifras) ? d.cifras.slice(0, 2) : [];
  const colores = [C.naranja, C.verde];
  const maximo = Math.max(...cifras.map(c => Number(c.valor) || 1), 1);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${d.color_fondo || '#0a0d1a'} 0%, ${C.fondoA} 50%, ${C.negro} 100%)`,
    }}>
      <LineaRoja frame={frame} delay={0} />

      {d.svg && <SvgEscena svgCode={d.svg} frame={frame} delay={5} />}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        padding: '140px 80px 100px',
      }}>
        <Etiqueta frame={frame} delay={4} texto={d.etiqueta || 'Contexto'} color={C.gris} />

        <div style={{
          ...slideUp(frame, fps, 8),
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 700,
          fontSize: 44,
          color: C.gris,
          lineHeight: 1.3,
          marginBottom: 60,
        }}>
          {d.titulo}
        </div>

        {cifras.length > 0 ? (
          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', height: 500 }}>
            {cifras.map((c, i) => {
              const delay = 20 + i * 30;
              const h = interpolate(Math.max(0, frame - delay), [0, 35], [0, 420 * (Number(c.valor) / maximo)], {
                extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
              });
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    fontFamily: '"Roboto Condensed", sans-serif',
                    fontWeight: 900,
                    fontSize: 160,
                    color: colores[i],
                    lineHeight: 1,
                    marginBottom: 12,
                    textShadow: `0 0 60px ${colores[i]}66`,
                    ...fadeIn(frame, delay),
                  }}>
                    {countUp(frame, delay, Number(c.valor))}
                    {c.sufijo && <span style={{ fontSize: 60 }}>{c.sufijo}</span>}
                  </div>
                  <div style={{
                    width: '100%', height: h,
                    background: `linear-gradient(180deg, ${colores[i]}, ${colores[i]}44)`,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: `0 -8px 40px ${colores[i]}44`,
                  }} />
                  <div style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: 28, color: C.gris,
                    textAlign: 'center', marginTop: 16,
                    ...fadeIn(frame, delay + 10),
                  }}>{c.etiqueta}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            ...slideUp(frame, fps, 16),
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 400, fontSize: 38,
            color: 'rgba(224,224,224,0.85)',
            lineHeight: 1.6,
            borderLeft: `4px solid ${C.verde}`,
            paddingLeft: 32,
          }}>
            {d.texto}
          </div>
        )}

        {d.fuente && (
          <div style={{
            position: 'absolute', bottom: 90, left: 80,
            fontFamily: '"Roboto", sans-serif',
            fontSize: 24, color: 'rgba(224,224,224,0.4)',
            ...fadeIn(frame, 60),
          }}>{d.fuente}</div>
        )}
      </div>

      <MarcaFija frame={frame} />
    </AbsoluteFill>
  );
};

// ─── ESCENA 3 — Dato clave ────────────────────────────────────────────────
const Escena3DatoClave = ({ d, frame, fps }) => {
  const pasos = Array.isArray(d.pasos) ? d.pasos.slice(0, 4) : [];

  const TextoResaltado = ({ texto, resaltado, color }) => {
    if (!resaltado || !texto) return <>{texto}</>;
    const i = texto.toLowerCase().indexOf(resaltado.toLowerCase());
    if (i < 0) return <>{texto}</>;
    return (
      <>
        {texto.slice(0, i)}
        <span style={{ color, textShadow: `0 0 30px ${color}` }}>{texto.slice(i, i + resaltado.length)}</span>
        {texto.slice(i + resaltado.length)}
      </>
    );
  };

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${d.color_fondo || '#0a1a0a'} 0%, ${C.fondoA} 60%, ${C.negro} 100%)`,
    }}>
      <LineaRoja frame={frame} delay={0} />

      {/* Línea lateral */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 6,
        background: `linear-gradient(180deg, ${C.verde}, ${C.verde}00)`,
        opacity: interpolate(Math.max(0, frame - 5), [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
      }} />

      {d.svg && <SvgEscena svgCode={d.svg} frame={frame} delay={5} />}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        padding: '140px 80px 100px',
      }}>
        <Etiqueta frame={frame} delay={4} texto={d.etiqueta || 'Dato clave'} color={C.verde} />

        <div style={{
          ...slideUp(frame, fps, 8),
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 900,
          fontSize: 72,
          color: C.blanco,
          lineHeight: 1.1,
          marginBottom: 32,
          letterSpacing: -1,
        }}>
          {(d.titulo || '').split('\n').map((l, i) => (
            <div key={i}>
              <TextoResaltado texto={l} resaltado={d.resaltado} color={C.verde} />
            </div>
          ))}
        </div>

        {d.subtitulo && (
          <div style={{
            ...fadeIn(frame, 18),
            fontFamily: '"Roboto", sans-serif',
            fontSize: 34, color: 'rgba(224,224,224,0.7)',
            marginBottom: 48, lineHeight: 1.4,
          }}>{d.subtitulo}</div>
        )}

        {pasos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pasos.map((p, i) => (
              <div key={i} style={{
                ...slideLeft(frame, fps, 28 + i * 12),
                display: 'flex', alignItems: 'center', gap: 20,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: `2px solid ${C.verde}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Roboto Condensed", sans-serif',
                  fontWeight: 700, fontSize: 16, color: C.verde,
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${C.verde}44`,
                }}>
                  {i + 1}
                </div>
                <div style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: p.nombre ? 28 : 32,
                  color: C.gris, lineHeight: 1.3,
                }}>
                  {p.nombre && (
                    <span style={{ color: C.verde, fontWeight: 700, marginRight: 12 }}>
                      {p.nombre}
                    </span>
                  )}
                  {p.texto || p}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MarcaFija frame={frame} />
    </AbsoluteFill>
  );
};

// ─── ESCENA 4 — Impacto ───────────────────────────────────────────────────
const Escena4Impacto = ({ d, frame, fps }) => {
  const hayNumero = d.numero !== undefined && d.numero !== null && d.numero !== '';
  const s = spr(frame, fps, 20, { damping: 12, stiffness: 120 });
  const scale = interpolate(s, [0, 1], [0.4, 1]);

  const TextoResaltado = ({ texto, resaltado, color }) => {
    if (!resaltado || !texto) return <>{texto}</>;
    const i = texto.toLowerCase().indexOf((resaltado || '').toLowerCase());
    if (i < 0) return <>{texto}</>;
    return (
      <>
        {texto.slice(0, i)}
        <span style={{ color, textShadow: `0 0 30px ${color}` }}>{texto.slice(i, i + resaltado.length)}</span>
        {texto.slice(i + resaltado.length)}
      </>
    );
  };

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 60%, ${d.color_fondo || '#1a1000'} 0%, ${C.fondoA} 55%, ${C.negro} 100%)`,
    }}>
      <LineaRoja frame={frame} delay={0} />

      {/* Glow central */}
      {hayNumero && (
        <div style={{
          position: 'absolute',
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.lima}18 0%, transparent 70%)`,
          opacity: interpolate(Math.max(0, frame - 15), [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }} />
      )}

      {d.svg && <SvgEscena svgCode={d.svg} frame={frame} delay={5} />}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        padding: '140px 80px 100px',
      }}>
        <Etiqueta frame={frame} delay={4} texto={d.etiqueta || 'Impacto'} color={C.lima} />

        <div style={{
          ...fadeIn(frame, 8),
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 400, fontSize: 40,
          color: C.gris, lineHeight: 1.3, marginBottom: 32,
        }}>{d.titulo}</div>

        {hayNumero && (
          <>
            <div style={{
              fontFamily: '"Roboto Condensed", sans-serif',
              fontWeight: 900,
              fontSize: String(d.numero).length > 4 ? 180 : 240,
              lineHeight: 0.9,
              color: C.lima,
              transform: `scale(${scale})`,
              transformOrigin: 'left center',
              opacity: interpolate(Math.max(0, frame - 20), [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
              marginBottom: 20,
              textShadow: `0 0 80px ${C.lima}66`,
            }}>
              {countUp(frame, 25, Number(d.numero), 50)}{d.sufijo || ''}
            </div>
            <div style={{
              height: 4,
              width: interpolate(Math.max(0, frame - 55), [0, 20], [0, 320], { extrapolateRight: 'clamp' }),
              background: `linear-gradient(90deg, ${C.lima}, transparent)`,
              marginBottom: 28, borderRadius: 2,
            }} />
          </>
        )}

        <div style={{
          ...fadeIn(frame, hayNumero ? 65 : 16),
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 700,
          fontSize: hayNumero ? 40 : 60,
          color: C.blanco,
          lineHeight: 1.3,
        }}>
          <TextoResaltado texto={d.texto} resaltado={d.resaltado} color={C.lima} />
        </div>
      </div>

      <MarcaFija frame={frame} />
    </AbsoluteFill>
  );
};

// ─── ESCENA 5 — Cierre ────────────────────────────────────────────────────
const Escena5Cierre = ({ d, frame, fps }) => {
  const TextoResaltado = ({ texto, resaltado, color }) => {
    if (!resaltado || !texto) return <>{texto}</>;
    const i = texto.toLowerCase().indexOf((resaltado || '').toLowerCase());
    if (i < 0) return <>{texto}</>;
    return (
      <>
        {texto.slice(0, i)}
        <span style={{ color, textShadow: `0 0 20px ${color}` }}>{texto.slice(i, i + resaltado.length)}</span>
        {texto.slice(i + resaltado.length)}
      </>
    );
  };

  const puntos = Array.from({ length: 24 }, (_, i) => ({
    cx: (i % 6) * 180 + 90,
    cy: Math.floor(i / 6) * 480 + 240,
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 100%, #0d1a0d 0%, #0a0a10 50%, ${C.negro} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 80,
    }}>
      <LineaRoja frame={frame} delay={0} />

      {/* Grid de puntos */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
        {puntos.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={3}
            fill={C.verde}
            opacity={0.4 + pulse(frame + i * 7, 0.02) * 0.6}
          />
        ))}
      </svg>

      {d.svg && <SvgEscena svgCode={d.svg} frame={frame} delay={5} />}

      <div style={{ zIndex: 10, textAlign: 'center', maxWidth: 900 }}>
        <div style={{
          ...slideUp(frame, fps, 6),
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 900,
          fontSize: 72,
          color: C.blanco,
          lineHeight: 1.15,
          marginBottom: 48,
          letterSpacing: -1,
        }}>
          {(d.titulo || '').split('\n').map((l, i) => (
            <div key={i}>
              <TextoResaltado texto={l} resaltado={d.resaltado} color={C.verde} />
            </div>
          ))}
        </div>

        {d.subtitulo && (
          <div style={{
            ...fadeIn(frame, 20),
            fontFamily: '"Roboto", sans-serif',
            fontSize: 32, color: 'rgba(224,224,224,0.6)',
            lineHeight: 1.5, marginBottom: 80,
          }}>{d.subtitulo}</div>
        )}

        <div style={{ ...fadeIn(frame, 30) }}>
          <Logo size={100} />
        </div>
      </div>

      {/* Barra roja abajo */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 10,
        background: `linear-gradient(90deg, ${C.rojo}, #ff4444)`,
        ...fadeIn(frame, 10),
      }} />
    </AbsoluteFill>
  );
};

// ─── Transición ────────────────────────────────────────────────────────────
const Transicion = ({ frame, color = C.verde }) => {
  const opacity = interpolate(frame, [0, 6, 14, 22], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      opacity, zIndex: 50,
    }} />
  );
};

// ─── Componente principal ─────────────────────────────────────────────────
export const EEVideo = ({ audioUrl, escenas, tiempos }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const e = escenas && typeof escenas === 'object' && !Array.isArray(escenas)
    ? escenas
    : {};

  const t = Array.isArray(tiempos) ? tiempos.map(Number) : [];
  let inicios;
  if (t.length === 5 && t.every(x => !isNaN(x))) {
    inicios = t.map(x => Math.max(0, Math.round(x * fps)));
    inicios[0] = 0;
  } else {
    const k = durationInFrames / 900;
    inicios = [0, 160, 380, 580, 780].map(n => Math.round(n * k));
  }

  const fin = i => (i < 4 ? inicios[i + 1] + 6 : durationInFrames) - inicios[i];

  const coloresTransicion = [C.naranja, C.verde, C.lima, C.naranja];

  const escenasLista = [
    <Escena1Gancho d={e.gancho || {}} frame={frame - inicios[0]} fps={fps} />,
    <Escena2Contexto d={e.contexto || {}} frame={frame - inicios[1]} fps={fps} />,
    <Escena3DatoClave d={e.dato || {}} frame={frame - inicios[2]} fps={fps} />,
    <Escena4Impacto d={e.impacto || {}} frame={frame - inicios[3]} fps={fps} />,
    <Escena5Cierre d={e.cierre || {}} frame={frame - inicios[4]} fps={fps} />,
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.negro, fontFamily: '"Roboto", sans-serif' }}>
      {audioUrl && <Audio src={audioUrl} />}

      {escenasLista.map((esc, i) => (
        <Sequence key={`e${i}`} from={inicios[i]} durationInFrames={Math.max(1, fin(i))}>
          {esc}
        </Sequence>
      ))}

      {[1, 2, 3, 4].map((i) => (
        <Sequence key={`t${i}`} from={Math.max(0, inicios[i] - 14)} durationInFrames={28}>
          <Transicion frame={frame - Math.max(0, inicios[i] - 14)} color={coloresTransicion[i - 1]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
