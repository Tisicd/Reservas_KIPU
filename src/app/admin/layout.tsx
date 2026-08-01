import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-violet-900 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-bold text-lg hover:text-violet-200 transition-colors"
            >
              Tziwu · Admin
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-violet-300 hover:text-white transition-colors"
            >
              Ver sitio público
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-violet-950 text-violet-400 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          Panel de administración — Tziwu Intercambios Culturales
        </div>
      </footer>
    </div>
  );
}
