import type { ReactNode } from "react";
import Figure from "./Figure";
import type { Pose } from "../data/skeleton";
import { useSettings } from "../store";

interface Props {
  front: Pose;
  profile: Pose;
  weight: number;
  ghostFront?: Pose | null;
  ghostProfile?: Pose | null;
  active?: boolean;
  compact?: boolean;
}

function Panel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex-1 min-w-0">
      <div className="relative aspect-[3/4] rounded-2xl bg-leaf border border-sumi-faint/30 shadow-rise overflow-hidden">
        {children}
      </div>
      <figcaption className="mt-2 text-center text-[11px] uppercase tracking-wide3 text-sumi-faint">
        {label}
      </figcaption>
    </figure>
  );
}

export default function DualView({
  front,
  profile,
  weight,
  ghostFront,
  ghostProfile,
  active,
}: Props) {
  const { t } = useSettings();
  return (
    <div className="flex gap-3 sm:gap-5">
      <Panel label={t("frontView")}>
        <Figure pose={front} weight={weight} variant="front" ghost={ghostFront} active={active} />
      </Panel>
      <Panel label={t("profileView")}>
        <Figure pose={profile} weight={weight} variant="profile" ghost={ghostProfile} active={active} />
      </Panel>
    </div>
  );
}
