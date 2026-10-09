import { useEffect } from 'react';
import './CursorWaterDrops.css';

export default function CursorWaterDrops() {
  useEffect(() => {
    let lastDropTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Throttle slightly to avoid too many DOM nodes
      if (now - lastDropTime < 30) return;
      lastDropTime = now;

      const drop = document.createElement('div');
      drop.className = 'water-drop';
      drop.style.left = `${e.clientX}px`;
      drop.style.top = `${e.clientY}px`;
      
      document.body.appendChild(drop);

      // Remove the drop after the animation is done (600ms)
      setTimeout(() => {
        drop.remove();
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
}
