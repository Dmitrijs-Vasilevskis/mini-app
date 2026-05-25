import { Text } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

import { useGameStore } from "../../store/gameStore";

const CARD_COLORS = {
    red: "#e53935",
    green: "#43a047",
    blue: "#1e88e5",
    yellow: "#fdd835",
    wild: "#212121",
};

type Props = ThreeElements["group"];

export function DiscardPile(props: Props) {

    const discardTop = useGameStore(
        (s) => s.discardTop
    );

    const activeColor = useGameStore(
        (s) => s.activeColor
    );

    const color =
        discardTop?.color ||
        activeColor ||
        "wild";

    const displayColor =
        CARD_COLORS[
            color as keyof typeof CARD_COLORS
        ] || "#222";

    return (
        <group {...props}>

            {/* CARD SHADOW */}
            <mesh
                position={[0, 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[1.3, 1.9]} />

                <meshStandardMaterial
                    color="#111"
                    transparent
                    opacity={0.35}
                />
            </mesh>

            {/* MAIN CARD */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.05, 0]}
            >
                <planeGeometry args={[1.2, 1.8]} />

                <meshStandardMaterial
                    color={displayColor}
                    metalness={0.1}
                    roughness={0.6}
                />
            </mesh>

            {/* INNER OVAL */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.06, 0]}
                scale={[0.7, 0.45, 1]}
            >
                <circleGeometry args={[0.7, 64]} />

                <meshStandardMaterial color="white" />
            </mesh>

            {/* CARD VALUE */}
            <Text
                position={[0, 0.07, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.45}
                color={displayColor}
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {discardTop?.value || "UNO"}
            </Text>

            {/* ACTIVE COLOR LABEL */}
            <Text
                position={[0, 0.08, -1.25]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.14}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Active: {activeColor}
            </Text>

        </group>
    );
}