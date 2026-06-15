import { BONES, type Joint, type Pose } from "../data/skeleton";

interface Props {
  pose: Pose;
  /** percent of weight on the screen-right foot (50 = even) */
  weight: number;
  variant: "front" | "profile";
  /** faint outline of the target keyframe, to show where the motion is heading */
  ghost?: Pose | null;
  /** use the celadon accent for the active figure */
  active?: boolean;
}

const HAND_JOINTS: Joint[] = ["wristL", "wristR"];
const HEADLESS_DOTS: Joint[] = [
  "neck",
  "pelvis",
  "shoulderL",
  "shoulderR",
  "elbowL",
  "elbowR",
  "hipL",
  "hipR",
  "kneeL",
  "kneeR",
  "ankleL",
  "ankleR",
];

function bonePath(pose: Pose) {
  return BONES.map((b) => {
    const [ax, ay] = pose[b.a];
    const [bx, by] = pose[b.b];
    return { d: `M ${ax} ${ay} L ${bx} ${by}`, w: b.near ? 2.3 : 1.7 };
  });
}

export default function Figure({ pose, weight, variant, ghost, active }: Props) {
  const bones = bonePath(pose);
  const ink = "currentColor";
  // weighted foot: emphasise the loaded leg with a celadon pad
  const onRight = weight > 53;
  const onLeft = weight < 47;
  const padR = pose.ankleR;
  const padL = pose.ankleL;

  return (
    <svg
      viewBox="0 0 100 130"
      className="block w-full h-full text-sumi"
      role="img"
      aria-label={variant === "front" ? "Figure de face" : "Figure de profil"}
    >
      {/* ground line + soft shadow under the feet */}
      <line x1="14" y1="121" x2="86" y2="121" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.6" />
      <ellipse cx={padL[0]} cy="121.5" rx={onLeft ? 7 : 4.5} ry="1.4" fill="currentColor" opacity={onLeft ? 0.16 : 0.08} />
      <ellipse cx={padR[0]} cy="121.5" rx={onRight ? 7 : 4.5} ry="1.4" fill="currentColor" opacity={onRight ? 0.16 : 0.08} />

      {/* ghost of the target keyframe */}
      {ghost &&
        bonePath(ghost).map((b, i) => (
          <path key={`g${i}`} d={b.d} stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        ))}

      {/* weighted-foot pads */}
      {onLeft && <circle cx={padL[0]} cy={padL[1]} r="3.4" fill="rgb(var(--celadon) / 0.28)" />}
      {onRight && <circle cx={padR[0]} cy={padR[1]} r="3.4" fill="rgb(var(--celadon) / 0.28)" />}

      {/* bones */}
      {bones.map((b, i) => (
        <path
          key={i}
          d={b.d}
          stroke={ink}
          strokeWidth={b.w}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}

      {/* joints */}
      {HEADLESS_DOTS.map((j) => (
        <circle key={j} cx={pose[j][0]} cy={pose[j][1]} r="1.35" fill={ink} />
      ))}

      {/* hands — a touch larger, suggesting the palm */}
      {HAND_JOINTS.map((j) => (
        <circle
          key={j}
          cx={pose[j][0]}
          cy={pose[j][1]}
          r="2.1"
          fill="rgb(var(--paper))"
          stroke={active ? "rgb(var(--celadon-deep))" : ink}
          strokeWidth="1.1"
        />
      ))}

      {/* head */}
      <circle
        cx={pose.head[0]}
        cy={pose.head[1]}
        r="5"
        fill="rgb(var(--paper))"
        stroke={ink}
        strokeWidth="1.8"
      />
    </svg>
  );
}
