import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { geographicLabels, sampleSatellites } from '../data/constants';
import type { GeographicLabel } from '../types';

// Label visibility based on zoom level (camera distance)
// Level 1 (far): Continents, Oceans (camera > 8)
// Level 2: Countries (camera 6-8)
// Level 3: Major Cities (camera 4-6)
// Level 4 (close): Local cities, landmarks (camera < 4)

function getLabelZoomLevel(cameraDistance: number): number {
  if (cameraDistance > 8) return 1;
  if (cameraDistance > 6) return 2;
  if (cameraDistance > 4) return 3;
  return 4;
}

function shouldRenderLabel(label: GeographicLabel, zoomLevel: number): boolean {
  const labelPriority: Record<string, number> = {
    continent: 1,
    ocean: 1,
    country: 2,
    state: 3,
    city: 3,
    capital: 3,
    landmark: 4,
  };

  const priority = labelPriority[label.type] || 3;
  return priority <= zoomLevel;
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { coordinates, setCoordinates } = useAppStore();

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.5, '#0d1f3c');
    gradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * canvas.height) / 12);
      ctx.lineTo(canvas.width, (i * canvas.height) / 12);
      ctx.stroke();
    }
    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      ctx.moveTo((i * canvas.width) / 24, 0);
      ctx.lineTo((i * canvas.width) / 24, canvas.height);
      ctx.stroke();
    }

    // Land masses (simplified continents)
    const landColor = '#1a3a2d';
    const continents = [
      // North America
      { x: 150, y: 180, w: 380, h: 280 },
      // South America
      { x: 280, y: 500, w: 180, h: 320 },
      // Europe
      { x: 950, y: 150, w: 200, h: 200 },
      // Africa
      { x: 980, y: 350, w: 220, h: 350 },
      // Asia
      { x: 1200, y: 120, w: 500, h: 400 },
      // Australia
      { x: 1550, y: 550, w: 200, h: 180 },
      // Antarctica
      { x: 800, y: 920, w: 500, h: 100 },
    ];

    ctx.fillStyle = landColor;
    continents.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  const handlePointerDown = (e: { stopPropagation: () => void; point?: THREE.Vector3 }) => {
    e.stopPropagation();
    if (e.point) {
      const lat = Math.asin(e.point.y / 2) * (180 / Math.PI);
      const lng = Math.atan2(e.point.x, e.point.z) * (180 / Math.PI);
      setCoordinates({ lat, lng });
    }
  };

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef} onPointerDown={handlePointerDown}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshStandardMaterial
          color="#4fc3f7"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Location marker */}
      {coordinates && <LocationMarker lat={coordinates.lat} lng={coordinates.lng} />}
    </group>
  );
}

function LocationMarker({ lat, lng }: { lat: number; lng: number }) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -2.05 * Math.sin(phi) * Math.cos(theta);
  const y = 2.05 * Math.cos(phi);
  const z = 2.05 * Math.sin(phi) * Math.sin(theta);

  return (
    <group position={[x, y, z]}>
      <mesh>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh>
        <ringGeometry args={[0.035, 0.05, 32]} />
        <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GeoLabels({ zoomLevel }: { zoomLevel: number }) {
  const filteredLabels = useMemo(() => {
    return geographicLabels.filter((label) => shouldRenderLabel(label, zoomLevel));
  }, [zoomLevel]);

  // Collision detection - hide overlapping labels
  const [visibleLabels, setVisibleLabels] = useState<typeof filteredLabels>(filteredLabels);

  useEffect(() => {
    // Simple collision avoidance - limit number of labels based on zoom
    const maxLabels = zoomLevel === 1 ? 15 : zoomLevel === 2 ? 25 : zoomLevel === 3 ? 35 : 50;
    setVisibleLabels(filteredLabels.slice(0, maxLabels));
  }, [filteredLabels, zoomLevel]);

  return (
    <group>
      {visibleLabels.map((label) => (
        <GeoLabel key={label.id} label={label} />
      ))}
    </group>
  );
}

function GeoLabel({ label }: { label: GeographicLabel }) {
  const phi = (90 - label.lat) * (Math.PI / 180);
  const theta = (label.lng + 180) * (Math.PI / 180);

  const x = 2.1 * Math.sin(phi) * Math.cos(theta);
  const y = 2.1 * Math.cos(phi);
  const z = 2.1 * Math.sin(phi) * Math.sin(theta);

  const typeStyles: Record<string, { color: string; size: string; className: string }> = {
    continent: { color: '#60a5fa', size: '14px', className: 'globe-label-continent' },
    ocean: { color: '#22d3ee', size: '14px', className: 'globe-label-continent' },
    country: { color: '#34d399', size: '11px', className: 'globe-label-country' },
    state: { color: '#a78bfa', size: '10px', className: 'globe-label-country' },
    city: { color: '#f472b6', size: '9px', className: 'globe-label-city' },
    capital: { color: '#fbbf24', size: '10px', className: 'globe-label-city' },
    landmark: { color: '#a78bfa', size: '8px', className: 'globe-label-landmark' },
  };

  const style = typeStyles[label.type] || typeStyles.city;
  const dotSize = label.type === 'continent' || label.type === 'ocean' ? 0 : 0.008;

  return (
    <group position={[x, y, z]}>
      {dotSize > 0 && (
        <mesh>
          <circleGeometry args={[dotSize, 16]} />
          <meshBasicMaterial color={style.color} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Html distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div
          className={`globe-label ${style.className}`}
          style={{
            color: style.color,
            fontSize: style.size,
          }}
        >
          {label.name}
        </div>
      </Html>
    </group>
  );
}

function SatelliteMarkers() {
  const groupRef = useRef<THREE.Group>(null);
  const { selectSatellite } = useAppStore();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x += Math.sin(state.clock.elapsedTime + i) * 0.00005;
        child.position.y += Math.cos(state.clock.elapsedTime + i) * 0.00005;
      });
    }
  });

  const typeColors: Record<string, string> = {
    communication: '#22d3ee',
    navigation: '#a78bfa',
    weather: '#34d399',
    scientific: '#f472b6',
    military: '#f87171',
    earth_observation: '#fb923c',
  };

  return (
    <group ref={groupRef}>
      {sampleSatellites.map((sat) => {
        const phi = (90 - sat.lat) * (Math.PI / 180);
        const theta = (sat.lng + 180) * (Math.PI / 180);
        const radius = 2 + sat.alt / 1000;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return (
          <group key={sat.id} position={[x, y, z]}>
            <mesh onClick={() => selectSatellite(sat)}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color={typeColors[sat.type] || '#ffffff'} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function CameraController({
  onZoomChange,
}: {
  onZoomChange: (level: number) => void;
}) {
  const { camera } = useThree();
  const { coordinates } = useAppStore();

  useEffect(() => {
    if (coordinates) {
      const phi = (90 - coordinates.lat) * (Math.PI / 180);
      const theta = (coordinates.lng + 180) * (Math.PI / 180);
      const radius = 5;

      const targetX = radius * Math.sin(phi) * Math.cos(theta);
      const targetY = radius * Math.cos(phi);
      const targetZ = radius * Math.sin(phi) * Math.sin(theta);

      // Smooth camera transition
      const startPos = camera.position.clone();
      const duration = 1500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        camera.position.x = startPos.x + (targetX - startPos.x) * easeT;
        camera.position.y = startPos.y + (targetY - startPos.y) * easeT;
        camera.position.z = startPos.z + (targetZ - startPos.z) * easeT;
        camera.lookAt(0, 0, 0);

        if (t < 1) requestAnimationFrame(animate);
      };
      animate();
    }
  }, [coordinates, camera]);

  // Track zoom level
  useFrame(() => {
    const distance = camera.position.length();
    const level = getLabelZoomLevel(distance);
    onZoomChange(level);
  });

  return null;
}

function CosmicBackground() {
  return (
    <>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <Stars radius={100} depth={100} count={500} factor={6} saturation={0} fade speed={0.3} />
    </>
  );
}

export default function EarthGlobe() {
  const { setSatellites } = useAppStore();
  const [zoomLevel, setZoomLevel] = useState(2);

  useEffect(() => {
    setSatellites(sampleSatellites);
  }, [setSatellites]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fc3f7" />

        <CosmicBackground />
        <Earth />
        <SatelliteMarkers />
        <GeoLabels zoomLevel={zoomLevel} />
        <CameraController onZoomChange={setZoomLevel} />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={12}
          enableZoom={true}
          zoomSpeed={0.5}
          rotateSpeed={0.3}
        />
      </Canvas>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-3 py-1.5 text-xs text-white/60">
        Zoom: {zoomLevel === 1 ? 'Continents' : zoomLevel === 2 ? 'Countries' : zoomLevel === 3 ? 'Cities' : 'Local'}
      </div>

      {/* Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs hidden md:block">
        Click on the globe to select a location | Scroll to zoom
      </div>
    </div>
  );
}
