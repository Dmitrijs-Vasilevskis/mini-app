import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function Table3D() {
  return (
    <Canvas camera={{ position: [0, 5, 10] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Just a simple cube or table model */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}