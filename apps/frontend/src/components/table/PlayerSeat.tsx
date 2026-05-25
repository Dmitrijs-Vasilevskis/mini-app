type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  name: string;
};

export function PlayerSeat({ position, rotation, name }: Props) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />

        <meshStandardMaterial color="#3498db" />
      </mesh>

      <mesh position={[0, -0.4, -1]}>
        <boxGeometry args={[2, 0.1, 1]} />

        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}
