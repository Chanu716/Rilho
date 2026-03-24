import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClickSpark({ children }) {
  const [sparks, setSparks] = useState([]);

  const handleClick = useCallback((e) => {
    // We only want to spark if they click on this wrapper
    const newSparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY,
      angle: (i * 45) * (Math.PI / 180),
    }));
    setSparks((prev) => [...prev, ...newSparks]);
  }, []);

  useEffect(() => {
    if (sparks.length > 0) {
      const timer = setTimeout(() => {
        setSparks([]); // cleanup after animation
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [sparks]);

  return (
    <div onClick={handleClick} className="relative w-full h-full">
      {children}
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ 
              x: spark.x, 
              y: spark.y, 
              scale: 0, 
              opacity: 1 
            }}
            animate={{ 
              x: spark.x + Math.cos(spark.angle) * 60,
              y: spark.y + Math.sin(spark.angle) * 60,
              scale: [0, 1, 0],
              opacity: [1, 1, 0]
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6', // primary-500
              pointerEvents: 'none',
              zIndex: 9999
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
