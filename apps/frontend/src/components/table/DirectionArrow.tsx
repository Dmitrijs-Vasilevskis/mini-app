import { useMemo } from "react";
import * as THREE from "three";

const SHAFT_RADIUS = 0.05;
const SHAFT_SEGMENTS = 40;
const SHAFT_LENGTH = 2.2;
const RESOLUTION = 16;

export function DirectionArrow({
  color = "#ffd54f",
  radius = 3.5,
  direction = 1,
  ...props
}) {
  //static texture creation
  const alphaTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.5, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    return new THREE.CanvasTexture(canvas);
  }, []);

  // arrow head geometry
  const flatHeadGeometry = useMemo(() => {
    const headLength = 0.4;
    const headWidth = 0.4;
    const depth = SHAFT_RADIUS * 1.8;

    const shape = new THREE.Shape();
    shape.moveTo(0, headLength);
    shape.lineTo(headWidth / 2, 0);
    shape.lineTo(0, headLength * 0.2);
    shape.lineTo(-headWidth / 2, 0);
    shape.lineTo(0, headLength);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateX(Math.PI / 2);
    geometry.rotateY(Math.PI / 2);
    return geometry;
  }, []);

  const { curve, headPosition, finalQuaternion } = useMemo(() => {
    const angularSpan = SHAFT_LENGTH / radius;
    const points = [];

    // arc path
    for (let i = 0; i <= RESOLUTION; i++) {
      const alpha = (i / RESOLUTION) * angularSpan;
      const x = radius * Math.sin(alpha);
      const z = -direction * radius * (1 - Math.cos(alpha));
      points.push(new THREE.Vector3(x, 0, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tangent = curve.getTangentAt(1).normalize();
    const headPosition = points[points.length - 1].toArray();

    const geometryDefaultForward = new THREE.Vector3(1, 0, 0);
    const finalQuaternion = new THREE.Quaternion().setFromUnitVectors(
      geometryDefaultForward,
      tangent
    );

    return {
      curve,
      headPosition,
      finalQuaternion,
    };
  }, [radius, direction]);

  return (
    <group {...props}>
      <group position-y={0.01}>
        <mesh>
          <tubeGeometry
            args={[curve, SHAFT_SEGMENTS, SHAFT_RADIUS, 12, false]}
          />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            alphaMap={alphaTexture}
            transparent={true}
            depthWrite={false}
          />
        </mesh>

        <mesh
          position={headPosition}
          quaternion={finalQuaternion}
          geometry={flatHeadGeometry}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}
