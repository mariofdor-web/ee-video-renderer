import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import { EEVideo } from './compositions/EEVideo';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="EEVideo"
        component={EEVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ guion: '', audioUrl: '', titulo: '', duracionSeg: 0 }}
        calculateMetadata={({ props }) => {
          const seg = Number(props.duracionSeg) || 0;
          return seg > 0 ? { durationInFrames: Math.ceil((seg + 0.5) * 30) } : {};
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
