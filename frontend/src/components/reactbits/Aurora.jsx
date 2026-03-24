import { useEffect, useRef } from 'react';

export default function Aurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw dark background (usually inherited via CSS but just in case)
      ctx.fillStyle = '#0f172a'; // tailwind slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create sweeping gradients
      const gradient1 = ctx.createRadialGradient(
        cx + Math.cos(time) * 300, cy + Math.sin(time) * 200, 0,
        cx, cy, 800
      );
      gradient1.addColorStop(0, 'rgba(139, 92, 246, 0.15)'); // purple
      gradient1.addColorStop(1, 'rgba(15, 23, 42, 0)');

      const gradient2 = ctx.createRadialGradient(
        cx - Math.sin(time * 0.8) * 400, cy + Math.cos(time * 0.8) * 300, 0,
        cx, cy, 800
      );
      gradient2.addColorStop(0, 'rgba(56, 189, 248, 0.1)'); // sky blue
      gradient2.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
