import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { UnoDrawPile } from "./UnoDrawPile";
import { UnoDiscardPile } from "./UnoDiscardPile";
import { AvatarPlayer } from "../player/AvatarPlayer";
import { useGameStore } from "../../store/gameStore";
import { DirectionIndicator } from "./DirectionIndicator";
import { useUnoLocalPlayer, useUnoPlayers } from "../../games/uno/hooks";

const SEAT_POSITIONS = [
  {
    position: [0, 0.5, -5],
    rotation: [0, 0, 0],
  },
  {
    position: [5, 0.5, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    position: [-5, 0.5, 0],
    rotation: [0, Math.PI / 2, 0],
  },
];

export function UnoTable3D() {
  const localPlayer = useUnoLocalPlayer();
  const players = useUnoPlayers();
  const currentTurn = useGameStore((s) => s.currentTurn);
  const direction = useGameStore((s) => s.direction);

  if (!localPlayer) {
    return null;
  }

  const otherPlayers = players.filter((p) => p.id !== localPlayer.id);

  return (
    <Canvas
      camera={{
        position: [0, 8, 8],
        fov: 40,
      }}
    >
      <ambientLight intensity={0.4} />

      <hemisphereLight intensity={0.8} color="#bcd6ff" groundColor="#2b2b3a" />

      <directionalLight position={[5, 10, 5]} intensity={1.2} />

      <fog attach="fog" args={["#1e2633", 8, 25]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#283042" />
      </mesh>

      {/* Table */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.5, 64]} />
        <meshStandardMaterial color="5c3a21" />
      </mesh>

      {/* Center Piles */}

      <UnoDrawPile position={[-1, 0.3, 0]} />
      <UnoDiscardPile position={[1, 0.31, 0]} />

      <DirectionIndicator direction={direction} />

      <AvatarPlayer
        position={[0, 0.5, 5]}
        rotation={[0, Math.PI, 0]}
        active={currentTurn === localPlayer.id}
        name={localPlayer?.name || "You"}
        playerId={localPlayer.id}
        cardCount={localPlayer.gameData.handCount}
        photoUrl={localPlayer.photoUrl}
      />

      {otherPlayers.map((player, index) => {
        const seat = SEAT_POSITIONS[index];

        if (!seat) return null;

        return (
          <AvatarPlayer
            name={player.name}
            playerId={player.id}
            photoUrl={player.photoUrl}
            active={currentTurn === player.id}
            position={seat.position as [number, number, number]}
            rotation={seat.rotation as [number, number, number]}
            cardCount={player.gameData.handCount}
            showCardsCount={true}
            isConnected={player.isConnected}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
