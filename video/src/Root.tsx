import { Composition } from "remotion";
import { STORY_FRAMES, Story } from "./Story";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="SiteNovoStory" component={Story} durationInFrames={STORY_FRAMES} fps={FPS} width={W} height={H} />
);
