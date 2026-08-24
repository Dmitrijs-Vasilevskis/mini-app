import { Canvas } from "@react-three/fiber";
import { useBjLocalPlayer } from "../hooks";
import { OrbitControls } from "@react-three/drei";
import { OvalTable } from "../../../components/games/bj/table/OvalTable";

export function BjTable() {
  const localPlayer = useBjLocalPlayer();

  if (!localPlayer) {
    return null;
  }

  // todo: add player and opptonents avatar renderers, create a dealer avatar
  // const opponents = players.filter((p) => p.id !== localPlayer.id);

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
      <OvalTable />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
