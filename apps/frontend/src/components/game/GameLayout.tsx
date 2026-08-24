import type { ReactNode } from "react";
import { VictoryOverlay } from "./VictoryOverlay";
import { RoundEndOverlay } from "./RoundEndOverlay";
import { EmoteWheel } from "../table/EmoteWheel";
import { PauseOverlay } from "../../game/hud/PauseOverlay";
import { FloatingActionText } from "../uno/FloatingActionText";

interface Props {
  scene: ReactNode;
  hud?: ReactNode;
  children?: ReactNode;
}

export default function GameLayout({ scene, hud, children }: Props) {
  return (
    <div className="relative h-screen w-screen text-white overflow-hidden bg-gradient-to-b from-[#ac61a3] to-[#2a57c0]">
      {/* hud */}
      {hud}

      {/* shared overlay, victory/round end overlay */}
      <VictoryOverlay />

      <RoundEndOverlay />

      <PauseOverlay />

      {/* 3d scene */}
      <div className="absolute inset-0">{scene}</div>

      {/* emote wheel */}
      <EmoteWheel />

      <FloatingActionText />

      {children}
    </div>
  );
}
