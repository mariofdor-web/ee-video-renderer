import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

const COLORES = {
  fondo: '#101010',
  verde: '#B8F259',
  lima: '#E1FD6D',
  naranja: '#FE883C',
  gris: '#E0E0E0',
  blanco: '#FFFFFF',
};

const Escena = ({ escena, frame, fps }) => {
  const entrada = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const opacidad = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(entrada, [0, 1], [60, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORES.fondo, padding: '120px 80px', justifyContent: 'center' }}>
      
      {/* Etiqueta de bloque */}
      <div style={{
        color: COLORES.verde,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 900,
        fontSize: 32,
        letterSpacing: 6,
        textTransform: 'uppercase',
        marginBottom: 40,
        opacity: opacidad,
      }}>
        {escena.etiqueta}
      </div>

      {/* Texto principal */}
      <div style={{
        color: COLORES.blanco,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        fontSize: escena.tamano || 72,
        lineHeight: 1.15,
        transform: `translateY(${translateY}px)`,
        opacity: opacidad,
      }}>
        {escena.texto}
      </div>

      {/* Dato destacado */}
      {escena.dato && (
        <div style={{
          marginTop: 60,
          backgroundColor: COLORES.verde,
          color: COLORES.fondo,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 900,
          fontSize: 120,
          padding: '20px 40px',
          alignSelf: 'flex-start',
          opacity: opacidad,
        }}>
          {escena.dato}
        </div>
      )}

      {/* Fuente */}
      {escena.fuente && (
        <div style={{
          position: 'absolute',
          bottom: 120,
          left: 80,
          color: COLORES.gris,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 300,
          fontSize: 28,
          opacity: opacidad,
        }}>
          Fuente: {escena.fuente}
        </div>
      )}

      {/* Logo EE */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        right: 80,
        color: COLORES.gris,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 900,
        fontSize: 24,
        letterSpacing: 4,
      }}>
        EL ESPECTADOR
      </div>
    </AbsoluteFill>
  );
};

export const EEVideo = ({ guion, audioUrl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPorEscena = 150; // 5 segundos por escena

  const escenaActual = Math.floor(frame / framesPorEscena);
  const frameEnEscena = frame % framesPorEscena;
  const escena = guion[escenaActual] || guion[guion.length - 1];

  return (
    <AbsoluteFill>
      {audioUrl && <Audio src={audioUrl} />}
      {escena && (
        <Escena
          escena={escena}
          frame={frameEnEscena}
          fps={fps}
        />
      )}
    </AbsoluteFill>
  );
};