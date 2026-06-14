export function DirectionArrow({ color = "#ffd54f", ...props }) {
  return (
    <group {...props}>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.36, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0.42, 0, 0]} rotation={[.4, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.4, 9]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
