interface Props {
  count: number;
  fanColor: string;
}

export function CardFan({ count, fanColor }: Props) {
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
