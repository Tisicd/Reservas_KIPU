import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import HeaderPublico from "@/components/HeaderPublico";

export const metadata: Metadata = {
  title: "Kipu — Intercambios Culturales",
  description: "Conectando culturas, creando experiencias. Reserva tu lugar en nuestros eventos de intercambio cultural.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
        <SplashScreen>
          <HeaderPublico />
          <main className="flex-1">{children}</main>
          <FooterPublico />
        </SplashScreen>
      </body>
    </html>
  );
}

function FooterPublico() {
  return (
    <footer style={{ background: "#1E1812", borderTop: "1px solid #3D2E1E" }} className="py-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.4))" }} />
          <img src="/logo-kipu.png" alt="KIPU" className="w-7 h-7 object-contain opacity-75" />
          <span className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(212,160,23,0.4), transparent)" }} />
        </div>
        <p className="font-hand text-xl mb-1" style={{ color: "#D4A017" }}>Cultura, comunidad y el idioma del corazón</p>
        <p className="text-xs mt-3" style={{ color: "#A89880", fontFamily: "'Montserrat', sans-serif" }}>@kipu_languagehub</p>
        <p className="text-xs mt-1" style={{ color: "#6E5F4C" }}>
          © {new Date().getFullYear()} Kipu — Intercambios Culturales
        </p>
      </div>
    </footer>
  );
}
