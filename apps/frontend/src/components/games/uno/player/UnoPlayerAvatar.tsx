import { useRef } from "react";
import { Text } from "@react-three/drei";
import type { Group } from "three";
import { useEmoteStore } from "../../../../store/emoteStore";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { usePlayerAnimationStore } from "../../../../store/playerAnimationStore";
import { LostConnectionIcon } from "../../../uno/connection/LostConnectionIcon";
import { PlayerModel } from "../../../player/PlayerModel";
import { FloatingEmote3D } from "../../../uno/FloatingEmote3D";
import type { AvatarId } from "@uno/shared";
import { CardFan } from "../card/CardFan";

type Props = ThreeElements["group"] & {
  name: string;
  playerId: string;
  active: boolean;
  cardCount?: number;
  showCardsCount?: boolean;
  isConnected?: boolean;
  showName?: boolean;
  avatarId?: AvatarId;
};

export function UnoPlayerAvatar({
  name,
  playerId,
  active,
  cardCount = 0,
  showCardsCount = false,
  isConnected = true,
  showName = true,
  avatarId = "astronaut",
  ...props
}: Props) {
  const animationQueue = usePlayerAnimationStore(
    (state) => state.animationQueues[playerId]
  );
  const playerActiveEmote = useEmoteStore(
    (state) => state.activeEmotes[playerId]
  );

  const animatedGroupRef = useRef<Group>(null);
  const textRef = useRef<any>(null);

  const fanColor =
    cardCount <= 2 ? "#ef4444" : cardCount <= 5 ? "#f59e0b" : "#3b82f6";

  useFrame(({ clock }) => {
    const group = animatedGroupRef.current;

    if (!group) {
      return;
    }

    if (!active) {
      group.position.y = 0;

      if (textRef.current) {
        textRef.current.scale.setScalar(1);
      }

      return;
    }

    const t = clock.getElapsedTime();

    group.position.y = Math.sin(t * 3) * 0.08;

    if (textRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.08;
      textRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group {...props}>
      {/* TURN RING */}
      {active && (
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.82, 32]} />

          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={3}
          />
        </mesh>
      )}

      <group ref={animatedGroupRef}>
        <CardFan count={cardCount} fanColor={fanColor} />
        <PlayerModel avatarId={avatarId} animationQueue={animationQueue} />
      </group>

      {showName && (
        <group ref={textRef} position={[0, 2.1, 0]}>
          <Text
            ref={textRef}
            position={[0, 2.1, 0]}
            fontSize={active ? 0.28 : 0.2}
            color={active ? "#facc15" : "white"}
            anchorX="center"
          >
            {name}
          </Text>
        </group>
      )}

      {playerActiveEmote && (
        <FloatingEmote3D
          emote={playerActiveEmote.emoteId}
          timestamp={playerActiveEmote.timestamp}
        />
      )}

      {!isConnected && (
        <group position={[0, 2.35, 0]}>
          <LostConnectionIcon color="#ef4444" position={[0, 0.22, 0]} />
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="#ef4444"
            anchorX="center"
            fontWeight="bold"
          >
            DISCONNECTED
          </Text>
        </group>
      )}
    </group>
  );
}
