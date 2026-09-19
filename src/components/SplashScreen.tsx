"use client";

import { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: Props) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return <>{children}</>;

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${
          exiting ? "splash-exit pointer-events-none" : ""
        }`}
        style={{
          background:
            "linear-gradient(160deg, #fafaf9 0%, #f0fdf4 40%, #fffbeb 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-6 animate-fade-in-up">
          <div
            className="w-28 h-28 flex items-center justify-center"
            style={{ animation: "logoReveal 1s ease-out both" }}
          >
            <img
              src="/logo-kipu.png"
              alt="Kipu"
              className="w-50 h-50 object-contain"
            />
          </div>

          <div
            className="text-center"
            style={{ animation: "fadeInUp 0.6s ease-out 0.8s both" }}
          >
            <p className="text-sm text-warm-500 mt-2 font-medium tracking-wider uppercase">
              Conectando culturas, creando experiencias
            </p>
          </div>

          <div
            className="w-16 h-0.5 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, #fbbf24, #22c55e, transparent)",
              animation: "fadeInUp 0.5s ease-out 1.2s both",
            }}
          />
        </div>
      </div>
      {children}
    </>
  );
}
