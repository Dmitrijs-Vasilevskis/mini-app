import { Canvas } from "@react-three/fiber";
import { useBjLocalPlayer, useBjPlayers } from "../hooks";
import { OrbitControls } from "@react-three/drei";
import { OvalTable } from "../../../components/games/bj/table/OvalTable";
import { PlayerAvatar } from "../../../components/player/PlayerAvatar";
import { useGameStore } from "../../../store/gameStore";
import { DealerAvatar } from "../../../components/games/bj/dealer/DealerAvatar";

const PLAYER_SEATS = [
  {
    position: [0, -1.1, 3.8] as [number, number, number],
    rotation: [0, Math.PI, 0] as [number, number, number],
  },

  {
    position: [-2.1, -1.1, 2.25] as [number, number, number],
    rotation: [0, Math.PI * 0.8, 0] as [number, number, number],
  },

  {
    position: [2.1, -1.1, 2.25] as [number, number, number],
    rotation: [0, -Math.PI * 0.8, 0] as [number, number, number],
  },
  {
    position: [-2.6, -1.1, -1.0] as [number, number, number],
    rotation: [0, Math.PI * 0.35, 0] as [number, number, number],
  },
  {
    position: [2.6, -1.1, -1.0] as [number, number, number],
    rotation: [0, -Math.PI * 0.35, 0] as [number, number, number],
  },
  {
    position: [0, -1.1, -2.35] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  },
];

const DEALER_SEAT = {
  position: [0, -1.1, -3.7] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
};

export function BjTable() {
  const localPlayer = useBjLocalPlayer();
  const players = useBjPlayers();
  const currentTurn = useGameStore((s) => s.currentTurn);

  if (!localPlayer) {
    return null;
  }

  const opponents = players.filter((p) => p.id !== localPlayer.id);

  const seatedPlayers = [localPlayer, ...opponents];

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
      <fog attach="fog" args={["#1e2633", 10, 40]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#283042" />
      </mesh>

      {/* Table */}
      <OvalTable />

      <DealerAvatar
        name="Dealer"
        position={DEALER_SEAT.position}
        rotation={DEALER_SEAT.rotation}
      />

      {seatedPlayers.map((player, index) => {
        const seat = PLAYER_SEATS[index];

        if (!seat) return null;

        return (
          <PlayerAvatar
            key={player.id}
            playerId={player.id}
            name={player.name}
            position={seat.position}
            rotation={seat.rotation}
            active={currentTurn === player.id}
            isConnected={player.isConnected}
            avatarId="astronaut"
          />
        );
      })}
      
      <OrbitControls
        enablePan={false}
        minDistance={10}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
