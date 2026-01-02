import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shader for glowing particles
const vertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vOpacity = 1.0 - smoothstep(0.0, 800.0, -mvPosition.z);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vOpacity * 0.6;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

interface ParticlesProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  paused?: boolean;
}

// Reduce default count for better performance
function Particles({ count = 800, mousePosition, paused = false }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Color palette: rose gold, soft pink, champagne
    const colorPalette = [
      new THREE.Color('hsl(15, 45%, 70%)'),   // Rose gold
      new THREE.Color('hsl(350, 40%, 65%)'),  // Soft pink
      new THREE.Color('hsl(30, 30%, 75%)'),   // Champagne
      new THREE.Color('hsl(280, 30%, 60%)'),  // Soft purple
      new THREE.Color('hsl(200, 40%, 70%)'),  // Soft blue
    ];

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere-like pattern
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 50 + Math.random() * 150;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 100;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    return [positions, colors, sizes];
  }, [count]);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (paused || !mesh.current) return;

    const time = state.clock.getElapsedTime();
    const positionArray = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle drift animation
      const drift = Math.sin(time * 0.3 + i * 0.01) * 2;
      const drift2 = Math.cos(time * 0.2 + i * 0.02) * 2;
      positionArray[i3] = originalPositions[i3] + drift;
      positionArray[i3 + 1] = originalPositions[i3 + 1] + drift2;
      positionArray[i3 + 2] = originalPositions[i3 + 2] + Math.sin(time * 0.1 + i * 0.005) * 3;

      // Mouse interaction - particles gently move away
      const mouseInfluence = 30;
      const dx = mousePosition.current.x * viewport.width * 0.5 - positionArray[i3];
      const dy = mousePosition.current.y * viewport.height * 0.5 - positionArray[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseInfluence) {
        const force = (1 - dist / mouseInfluence) * 5;
        positionArray[i3] -= (dx / dist) * force;
        positionArray[i3 + 1] -= (dy / dist) * force;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleNebula({ paused = false }: { paused?: boolean }) {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (paused) return;
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [paused]);

  if (paused) return null;
  return (
    <div className="particles-canvas">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Particles mousePosition={mousePosition} paused={paused} />
      </Canvas>
    </div>
  );
}
