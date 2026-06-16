import type { ThreeElements } from "@react-three/fiber";

export function LostConnectionIcon({
    color,
    ...props
  }: { color: string } & ThreeElements["group"]) {
    return (
      <group {...props}>
        <mesh position={[0, -0.08, 0]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color={color} depthWrite={false} />
        </mesh>
  
        <mesh position={[0, -0.08, 0]}>
          <ringGeometry
            args={[0.09, 0.13, 32, 1, Math.PI * 0.25, Math.PI * 0.5]}
          />
          <meshBasicMaterial color={color} depthWrite={false} />
        </mesh>
  
        <mesh position={[0, -0.08, 0]}>
          <ringGeometry
            args={[0.18, 0.22, 32, 1, Math.PI * 0.25, Math.PI * 0.5]}
          />
          <meshBasicMaterial color={color} depthWrite={false} />
        </mesh>
  
        <mesh position={[0, 0.02, 0.001]} rotation={[0, 0, -Math.PI / 4]}>
          <planeGeometry args={[0.03, 0.32]} />
          <meshBasicMaterial color={color} depthWrite={false} />
        </mesh>
      </group>
    );
  }