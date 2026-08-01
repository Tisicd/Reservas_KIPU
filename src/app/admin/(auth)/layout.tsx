export const dynamic = "force-dynamic";

import Link from "next/link";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";

export default async function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    redirect("/admin/login");
  }

  return (
    <>
      <div className="flex items-center gap-4 px-4 py-2 bg-violet-950 text-violet-200">
        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-violet-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/clientes"
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-violet-800 transition-colors"
          >
            Clientes
          </Link>
        </nav>
        <div className="flex-1" />
        <BotonCerrarSesion />
      </div>
      {children}
    </>
  );
}
