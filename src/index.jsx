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
        defaultProps={{
          guion: [],
          audioUrl: '',
          titulo: ''
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);