"use client";

import Link from "next/link";

const NAV = [
  { label: "Init", href: "/" },
  { label: "About Kipu", href: "/#origin" },
  { label: "Events", href: "/#eventos" },
  { label: "Community", href: "/#community" },
  { label: "Contact", href: "mailto:info@kipu.com" },
];

export default function HeaderPublico() {
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "#1A3A2A", borderColor: "#234D37" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo-kipu.png" alt="KIPU" className="w-9 h-9 object-contain" />
          <div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "#FDFBF7", fontFamily: "'Inter', sans-serif" }}>KIPU</span>
            <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase" style={{ color: "#D4A017" }}>Language Hub</span>
          </div>
        </Link>
        <nav className="flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: "#E8E0D4", fontFamily: "'Montserrat', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#D4A017"; e.currentTarget.style.background = "rgba(46,125,50,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#E8E0D4"; e.currentTarget.style.background = "transparent"; }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
