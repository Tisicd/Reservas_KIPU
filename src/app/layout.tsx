import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reservas Tziwu — Intercambios Culturales",
  description: "Sistema de reservas para eventos de intercambio cultural",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🌍</span>
              <div>
                <span className="font-bold text-lg text-violet-700 group-hover:text-violet-800">
                  Tziwu
                </span>
                <span className="hidden sm:inline text-stone-500 text-sm ml-2">
                  Intercambios Culturales
                </span>
              </div>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-violet-700 rounded-lg hover:bg-violet-50 transition-colors"
              >
                Eventos
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-stone-200 py-6 mt-auto">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-stone-500">
            © {new Date().getFullYear()} Tziwu — Intercambios Culturales
          </div>
        </footer>
      </body>
    </html>
  );
}
