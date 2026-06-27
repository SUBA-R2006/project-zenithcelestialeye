import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  delay: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);

    const generatedShootingStars: ShootingStar[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 10,
      angle: Math.random() * 45 + 30,
      delay: Math.random() * 10 + i * 3,
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark via-cosmic-nebula/50 to-cosmic-darker" />

      <div className="absolute inset-0 bg-cosmic-grid opacity-30" />

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {shootingStars.map((ss) => (
        <motion.div
          key={ss.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${ss.x}%`,
            top: `${ss.y}%`,
            boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.5)',
          }}
          animate={{
            x: [0, 200],
            y: [0, 200],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: ss.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 15 + 10,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] animate-pulse-slow" />
    </div>
  );
}
