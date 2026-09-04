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
            position={[offset * 0.12, 1.05, 0.5]}
            rotation={[0.8, 0.12, offset * -0.16]}
          >
            <boxGeometry args={[0.44, 0.64, 0.04]} />
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
