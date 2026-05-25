import { Text } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

type Props = ThreeElements["group"] & {
    count?: number;
};

export function DrawPile({
    count = 0,
    ...props
}: Props) {

    return (
        <group {...props}>

            {/* STACKED CARDS */}
            {Array.from({ length: 5 }).map((_, index) => (
                <mesh
                    key={index}
                    position={[
                        0,
                        index * 0.02,
                        index * 0.02,
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    castShadow
                    receiveShadow
                >
                    <planeGeometry args={[1.2, 1.8]} />

                    <meshStandardMaterial
                        color="#2563eb"
                    />
                </mesh>
            ))}

            {/* TOP CARD OUTLINE */}
            <mesh
                position={[0, 0.12, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[1.2, 1.8]} />

                <meshStandardMaterial
                    color="#1d4ed8"
                    metalness={0.2}
                    roughness={0.6}
                />
            </mesh>

            {/* UNO LABEL */}
            <Text
                position={[0, 0.14, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.18}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                UNO
            </Text>

            {/* CARD COUNT */}
            <Text
                position={[0, 0.14, -1.3]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.14}
                color="#e5e7eb"
                anchorX="center"
                anchorY="middle"
            >
                {count} cards
            </Text>
        </group>
    );
}