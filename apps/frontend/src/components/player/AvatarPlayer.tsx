import { Text, useTexture } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { LostConnectionIcon } from "../uno/connection/LostConnectionIcon";
import { getProxiedAvatarUrl } from "../../utils/avatar";
import { useEmoteStore } from "../../store/emoteStore";
import { FloatingEmote3D } from "../uno/FloatingEmote3D";

type Props = ThreeElements["group"] & {
  name: string;
  playerId: string;
  active?: boolean;
  cardCount?: number;
  showCardsCount?: boolean;
  isConnected?: boolean;
  photoUrl?: string;
};

export function AvatarPlayer({
  name,
  playerId,
  active,
  cardCount = 0,
  showCardsCount = false,
  isConnected = true,
  photoUrl,
  ...props
}: Props) {
  const groupRef = useRef<Group>(null);
  const textRef = useRef<any>(null);

  const playerEmote = useEmoteStore((s) => s.activeEmotes[playerId]);

  const [isValidImage, setIsValidImage] = useState(false);

  const fanColor =
    cardCount <= 2 ? "#ef4444" : cardCount <= 5 ? "#f59e0b" : "#3b82f6";

  useEffect(() => {
    if (!photoUrl) {
      setIsValidImage(false);
      return;
    }

    const img = new Image();
    img.src = photoUrl;
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
  }, [photoUrl]);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    if (!active) {
      groupRef.current.position.y = 0;
      return;
    }

    const t = clock.getElapsedTime();

    if (textRef.current && active) {
      const s = 1 + Math.sin(t * 3) * 0.08;
      textRef.current.scale.set(s, s, s);
    }

    groupRef.current.position.y = Math.sin(t * 3) * 0.08;
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

      {/* PULSING PLAYER */}
      <group ref={groupRef}>
        {/* CARDS FAN */}
        <CardFan count={cardCount} fanColor={fanColor} />

        {/* BODY */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />

          <meshStandardMaterial color="#2563eb" />
        </mesh>

        {/* HEAD */}
        <mesh position={[0, 1.5, 0]} scale={1.25}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color="#f5d0a9" roughness={0.5} />
        </mesh>

        <mesh position={[0, 1.55, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.3, 32]} />
          <meshStandardMaterial
            color="#f5d0a9"
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, 1.55, 0.401]} scale={1.4}>
          <circleGeometry args={[0.22, 32]} />

          {photoUrl && isValidImage ? (
            <Suspense
              fallback={
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              }
            >
              <ProxyAvatarFace avatarUrl={photoUrl} />
            </Suspense>
          ) : (
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          )}
        </mesh>

        {playerEmote && (
          <FloatingEmote3D
            emote={playerEmote.emoteId}
            timestamp={playerEmote.timestamp}
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

        {/* NAME */}
        <Text
          ref={textRef}
          position={[0, 2.1, 0]}
          fontSize={active ? 0.28 : 0.2}
          color={active ? "#facc15" : "white"}
          anchorX="center"
        >
          {name}
        </Text>

        {showCardsCount && (
          <Text
            position={[1.5, 1.5, 0]}
            fontSize={0.3}
            color={fanColor}
            anchorX="center"
          >
            Cards: {cardCount}
          </Text>
        )}
      </group>
    </group>
  );
}

function CardFan({ count, fanColor }: { count: number; fanColor: string }) {
  const visibleCards = Math.min(count, 8);

  return (
    <>
      {Array.from({ length: visibleCards }).map((_, i) => {
        const offset = i - (visibleCards - 1) / 2;

        return (
          <mesh
            key={i}
            position={[offset * 0.08, 1.05, 0.5]}
            rotation={[0.6, 0, offset * -0.12]}
          >
            <boxGeometry args={[0.22, 0.32, 0.02]} />
            <meshStandardMaterial
              color={fanColor}
              emissive={fanColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </>
  );
}

function ProxyAvatarFace({ avatarUrl }: { avatarUrl: string }) {
  const proxiedUrl = getProxiedAvatarUrl(avatarUrl);
  const texture = useTexture(proxiedUrl ?? "");

  return <meshBasicMaterial map={texture} transparent={true} />;
}
