import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { CallToAction } from "./scenes/CallToAction";
import { Features } from "./scenes/Features";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { ScrollTour } from "./scenes/ScrollTour";
import { WhatsApp } from "./scenes/WhatsApp";

const T = 15; // duração de cada transição (quadros)

export const scenes = [
  { id: "intro", frames: 80, el: <Intro /> },
  { id: "hook", frames: 105, el: <Hook /> },
  { id: "tour", frames: 270, el: <ScrollTour /> },
  { id: "features", frames: 150, el: <Features /> },
  { id: "whatsapp", frames: 225, el: <WhatsApp /> },
  { id: "cta", frames: 130, el: <CallToAction /> },
];

export const STORY_FRAMES = scenes.reduce((n, s) => n + s.frames, 0) - T * (scenes.length - 1);

const transitions = [
  { p: fade(), t: linearTiming({ durationInFrames: T }) },
  { p: slide({ direction: "from-bottom" }), t: springTiming({ durationInFrames: T, config: { damping: 200 } }) },
  { p: slide({ direction: "from-right" }), t: springTiming({ durationInFrames: T, config: { damping: 200 } }) },
  { p: slide({ direction: "from-bottom" }), t: springTiming({ durationInFrames: T, config: { damping: 200 } }) },
  { p: fade(), t: linearTiming({ durationInFrames: T }) },
];

/** Story 1080x1920: apresenta o site novo e termina no WhatsApp comercial. */
export const Story: React.FC = () => (
  <TransitionSeries>
    {scenes.flatMap((s, i) => {
      const seq = (
        <TransitionSeries.Sequence key={s.id} durationInFrames={s.frames}>
          {s.el}
        </TransitionSeries.Sequence>
      );
      const tr = transitions[i];
      return tr
        ? [seq, <TransitionSeries.Transition key={`${s.id}-t`} presentation={tr.p} timing={tr.t} />]
        : [seq];
    })}
  </TransitionSeries>
);
