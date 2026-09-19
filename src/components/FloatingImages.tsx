"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const MAIN_IMAGES = [
  { src: "/assets/kipu1.jpg", x: 22, y: 28, rot: -6 },
  { src: "/assets/kipu2.jpg", x: 78, y: 28, rot: 8 },
  { src: "/assets/kipu3.jpg", x: 22, y: 72, rot: -4 },
  { src: "/assets/kipu4.jpg", x: 78, y: 72, rot: 5 },
];

export default function FloatingImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const [drag, setDrag] = useState<{ index: number | null; ox: number; oy: number }>({ index: null, ox: 0, oy: 0 });

  const refs = useRef(MAIN_IMAGES.map((img) => ({
    baseX: img.x, baseY: img.y, dragX: 0, dragY: 0,
    phase: Math.random() * Math.PI * 2, rot: img.rot, scale: 1, dragging: false,
  })));

  const [pos, setPos] = useState(MAIN_IMAGES.map((img) => ({ x: img.x, y: img.y, rot: img.rot, scale: 1 })));

  useEffect(() => {
    const loop = () => {
      const t = (timeRef.current += 0.016);
      const r = refs.current;
      setPos((prev) => {
        const np = [...prev];
        for (let i = 0; i < r.length; i++) {
          if (r[i].dragging) continue;
          np[i] = { x: r[i].baseX + r[i].dragX + Math.sin(t * 2.5 + r[i].phase) * 1.5, y: r[i].baseY + r[i].dragY + Math.cos(t * 3.1 + r[i].phase + 1) * 1.8, rot: r[i].rot, scale: r[i].scale };
        }
        return np;
      });
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const getPct = useCallback((cx: number, cy: number) => {
    const el = containerRef.current;
    if (!el) return { x: 50, y: 50 };
    const rect = el.getBoundingClientRect();
    return { x: ((cx - rect.left) / rect.width) * 100, y: ((cy - rect.top) / rect.height) * 100 };
  }, []);

  const onDown = useCallback((i: number) => (e: React.PointerEvent) => {
    e.preventDefault(); (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const p = getPct(e.clientX, e.clientY);
    const r = refs.current[i];
    r.dragging = true; r.scale = 1.15;
    setDrag({ index: i, ox: r.baseX + r.dragX - p.x, oy: r.baseY + r.dragY - p.y });
    setPos((pv) => { const np = [...pv]; np[i] = { ...np[i], scale: 1.15 }; return np; });
  }, [getPct]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (drag.index === null) return;
    const p = getPct(e.clientX, e.clientY);
    const r = refs.current[drag.index];
    const nx = p.x + drag.ox, ny = p.y + drag.oy;
    r.dragX = nx - r.baseX; r.dragY = ny - r.baseY;
    setPos((pv) => { const np = [...pv]; np[drag.index!] = { ...np[drag.index!], x: nx, y: ny }; return np; });
  }, [drag, getPct]);

  const onUp = useCallback(() => {
    if (drag.index === null) return;
    refs.current[drag.index].dragging = false;
    refs.current[drag.index].scale = 1;
    setDrag({ index: null, ox: 0, oy: 0 });
    setPos((pv) => { const np = [...pv]; np[drag.index!] = { ...np[drag.index!], scale: 1 }; return np; });
  }, [drag]);

  return (
    <div ref={containerRef} className="relative max-w-lg mx-auto h-[280px] sm:h-[360px]" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.3" /><stop offset="100%" stopColor="#D4A017" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {MAIN_IMAGES.map((_, i) => <line key={i} x1={`${pos[i].x}%`} y1={`${pos[i].y}%`} x2="50%" y2="50%" stroke="url(#lg)" strokeWidth="0.4" />)}
        {MAIN_IMAGES.map((_, i) => <circle key={`k${i}`} cx={`${pos[i].x}%`} cy={`${pos[i].y}%`} r="1" fill={i % 2 === 0 ? "#2E7D32" : "#D4A017"} opacity="0.5" />)}
        <circle cx="50%" cy="50%" r="2" fill="#D4A017" opacity="0.25" />
      </svg>

      {MAIN_IMAGES.map((img, i) => {
        const p = pos[i];
        return (
          <div key={i} className={`absolute w-20 h-20 sm:w-28 sm:h-28 cursor-grab active:cursor-grabbing transition-shadow duration-200 z-10 ${drag.index === i ? "z-30" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-50%) rotate(${p.rot}deg) scale(${p.scale})`, transition: drag.index === i ? "none" : "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)" }}
            onPointerDown={onDown(i)}>
            <div className={`w-full h-full rounded-full border-[3px] border-white shadow-md overflow-hidden ${drag.index === i ? "shadow-xl" : ""}`}>
              <img src={img.src} alt="" className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />
            </div>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <img src="/assets/kipu10.jpg" alt="Kipu" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-[3px] border-primary-400 shadow-lg" />
      </div>
    </div>
  );
}
