export const dynamic = "force-dynamic";

import { getTodosClientes } from "@/lib/actions";
import Link from "next/link";
import { db } from "@/db";
import { reservas } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export default async function ClientesPage() {
  const clientes = await getTodosClientes();

  const clientesConAsistencias = await Promise.all(
    clientes.map(async (cliente) => {
      const [result] = await db
        .select({ total: count() })
        .from(reservas)
        .where(eq(reservas.clienteId, cliente.id));
      return { ...cliente, asistencias: result?.total ?? 0 };
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin" className="btn-ghost text-sm mb-6 inline-flex">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
        </svg>
        Volver al dashboard
      </Link>

      <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">Clientes</h1>
      <p className="text-warm-500 mb-8">
        {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado{clientes.length !== 1 ? "s" : ""}
      </p>

      <div className="card overflow-hidden">
        {clientesConAsistencias.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
            </div>
            <p className="text-warm-400 text-sm">No hay clientes aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-warm-50 text-left">
                  <th className="px-5 py-3 font-medium text-warm-500">Nombre</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Edad</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Idiomas</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Asistencias</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Contacto</th>
                  <th className="px-5 py-3 font-medium text-warm-500">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {clientesConAsistencias.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-warm-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-warm-800">{cliente.nombreCompleto}</td>
                    <td className="px-5 py-3 text-warm-500">{cliente.edad}</td>
                    <td className="px-5 py-3 text-warm-500">{cliente.idiomas}</td>
                    <td className="px-5 py-3">
                      <span className={
                        cliente.asistencias >= 3 ? "badge badge-warning" :
                        cliente.asistencias >= 1 ? "badge badge-success" : "badge"
                      }>
                        {cliente.asistencias} evento{cliente.asistencias !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-warm-500 text-xs">{cliente.telefono || cliente.email || "—"}</td>
                    <td className="px-5 py-3 text-warm-400 text-xs">{cliente.creadoEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
