export function OvalTable() {
    return (
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} scale={[1.6, 1, 1]} receiveShadow castShadow>
          <cylinderGeometry args={[3.2, 3.2, 0.2, 64]} />
          <meshStandardMaterial
            color="#1b5235" 
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
  
        <mesh position={[0, -0.12, 0]} scale={[1.6, 1, 1]} castShadow>
          <cylinderGeometry args={[3.45, 3.45, 0.15, 64]} />
          <meshStandardMaterial
            color="#3b1f10"
            roughness={0.3}
          />
        </mesh>
  
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[1.2, 1.8, 1.0, 32]} />
          <meshStandardMaterial color="#21130a" roughness={0.5} />
        </mesh>
      </group>
    );
  }